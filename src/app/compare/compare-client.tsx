"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AUTH_API_URL, SERVICE_DOMAIN } from "@/lib/constants";
import markdownToHtml from "@/lib/markdownToHtml";
import { useConsole } from "../console/console-context";
import { authHeaders } from "../console/console-utils";
import {
  buildDocumentPreamble,
  COMPARE_SECTIONS,
  type CompareSection,
} from "./sections";

const AI_API_URL = `https://ai.${SERVICE_DOMAIN}`;
const DRAFT_KEY = "compare-draft";
const MAX_FILE_BYTES = 25 * 1024 * 1024;
// A draft survives the login round-trip in localStorage; attachments
// above this base64 size would blow the storage quota, so they're
// dropped and the user is asked to re-attach after signing in.
const MAX_DRAFT_ATTACHMENT_CHARS = 3_000_000;

/**
 * Fallback selection when the ai-proxy /health probe fails. Mirrors
 * ai-proxy's DEFAULT_COMPARE_MODELS — the live list from /health wins
 * whenever it's reachable.
 */
const FALLBACK_BASE = "legalese-compare-4";
const FALLBACK_MODELS = [
  "anthropic/claude-opus-4.5",
  "anthropic/claude-sonnet-4.5",
  "openai/gpt-5.1",
  "google/gemini-3-pro-preview",
  "x-ai/grok-4",
  "meta-llama/llama-4-maverick",
  "deepseek/deepseek-chat-v3.1",
  "qwen/qwen3-235b-a22b",
];

interface Attachment {
  name: string;
  mediaType: string;
  dataBase64: string;
}

type SectionStatus = "pending" | "streaming" | "done" | "error" | "skipped";

interface SectionRun {
  section: CompareSection;
  status: SectionStatus;
  text: string;
  error?: string;
}

interface ColumnRun {
  slug: string;
  sections: SectionRun[];
  limitHit: boolean;
  fatal?: string;
}

interface Draft {
  doc: string;
  models: string[];
  sections: string[];
  attachment: Attachment | null;
  attachmentLost: boolean;
  autorun: boolean;
}

/** "anthropic/claude-opus-4.5" → "Claude Opus 4.5" */
function slugLabel(slug: string): string {
  const name = slug.includes("/") ? slug.slice(slug.indexOf("/") + 1) : slug;
  return name
    .split("-")
    .map((w) => (/^\d/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

function slugProvider(slug: string): string {
  return slug.includes("/") ? slug.slice(0, slug.indexOf("/")) : "";
}

async function* parseSse(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<{ event?: string; data: string }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      let idx: number;
      while ((idx = buf.indexOf("\n\n")) >= 0) {
        const raw = buf.slice(0, idx).replace(/\r/g, "");
        buf = buf.slice(idx + 2);
        let event: string | undefined;
        const dataLines: string[] = [];
        for (const line of raw.split("\n")) {
          if (line.startsWith("event:")) event = line.slice(6).trim();
          else if (line.startsWith("data:"))
            dataLines.push(line.slice(5).trimStart());
        }
        if (dataLines.length) yield { event, data: dataLines.join("\n") };
      }
    }
  } finally {
    reader.releaseLock();
  }
}

const MARKDOWN_CLASS =
  "text-sm leading-relaxed text-gray-800 break-words " +
  "[&_h1]:text-sm [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-1 " +
  "[&_h2]:text-sm [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-1 " +
  "[&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 " +
  "[&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 " +
  "[&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_li]:my-0.5 " +
  "[&_table]:my-2 [&_table]:block [&_table]:overflow-x-auto [&_table]:text-xs " +
  "[&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left " +
  "[&_td]:border [&_td]:border-gray-200 [&_td]:px-2 [&_td]:py-1 [&_td]:align-top " +
  "[&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs " +
  "[&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:overflow-x-auto [&_pre]:my-2 " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600";

function SectionBody({ run }: { run: SectionRun }) {
  const [html, setHtml] = useState("");
  const doneText = run.status === "done" ? run.text : null;
  useEffect(() => {
    if (doneText === null) return;
    let alive = true;
    markdownToHtml(doneText).then((h) => {
      if (alive) setHtml(h);
    });
    return () => {
      alive = false;
    };
  }, [doneText]);

  if (run.status === "done" && html) {
    return (
      <div
        className={MARKDOWN_CLASS}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
      {run.text}
      {run.status === "streaming" && (
        <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse align-text-bottom ml-0.5" />
      )}
    </div>
  );
}

export function CompareClient() {
  const { session, loading } = useConsole();

  // ── Input state ─────────────────────────────────────────────────
  const [doc, setDoc] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [baseName, setBaseName] = useState(FALLBACK_BASE);
  const [available, setAvailable] = useState<string[]>(FALLBACK_MODELS);
  const [models, setModels] = useState<string[]>([FALLBACK_MODELS[0], "", ""]);
  const [sectionIds, setSectionIds] = useState<Set<string>>(
    () => new Set(COMPARE_SECTIONS.map((s) => s.id)),
  );
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingAutorun, setPendingAutorun] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Run state ───────────────────────────────────────────────────
  const [columns, setColumns] = useState<ColumnRun[] | null>(null);
  const [running, setRunning] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const autorunFired = useRef(false);

  // Live model list from the proxy. /health is unauthenticated, so the
  // pickers are populated before sign-in. Compare variants are listed
  // as "{baseName}:{openrouterSlug}".
  useEffect(() => {
    fetch(`${AI_API_URL}/health`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const variants = ((data?.models as string[]) ?? []).filter((m) =>
          m.includes(":"),
        );
        if (!variants.length) return;
        setBaseName(variants[0].slice(0, variants[0].indexOf(":")));
        const slugs = variants.map((v) => v.slice(v.indexOf(":") + 1));
        setAvailable(slugs);
        setModels((prev) =>
          prev.map((m, i) =>
            m && slugs.includes(m) ? m : i === 0 ? slugs[0] : "",
          ),
        );
      })
      .catch(() => {});
  }, []);

  // Restore a draft stashed before the login redirect.
  useEffect(() => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    localStorage.removeItem(DRAFT_KEY);
    try {
      const d = JSON.parse(raw) as Draft;
      setDoc(d.doc ?? "");
      if (Array.isArray(d.models) && d.models.length === 3) setModels(d.models);
      if (Array.isArray(d.sections)) setSectionIds(new Set(d.sections));
      setAttachment(d.attachment ?? null);
      if (d.attachmentLost) {
        setNotice(
          "Your uploaded file couldn't be kept across sign-in — please attach it again.",
        );
      }
      setPendingAutorun(!!d.autorun && !d.attachmentLost);
    } catch {
      // corrupt draft — ignore
    }
  }, []);

  const hasAiPermission = !session || session.permissions.includes("ai:chat");
  const selectedModels = models.filter(Boolean);
  const selectedSections = COMPARE_SECTIONS.filter(
    (s) => s.locked || sectionIds.has(s.id),
  );
  const canSubmit =
    !running &&
    (doc.trim().length > 0 || attachment !== null) &&
    selectedModels.length > 0;

  // ── Run engine ──────────────────────────────────────────────────

  function updateSection(
    colIdx: number,
    secIdx: number,
    patch: Partial<SectionRun> | ((prev: SectionRun) => Partial<SectionRun>),
  ) {
    setColumns((prev) => {
      if (!prev) return prev;
      return prev.map((col, ci) => {
        if (ci !== colIdx) return col;
        return {
          ...col,
          sections: col.sections.map((sec, si) => {
            if (si !== secIdx) return sec;
            const p = typeof patch === "function" ? patch(sec) : patch;
            return { ...sec, ...p };
          }),
        };
      });
    });
  }

  function updateColumn(colIdx: number, patch: Partial<ColumnRun>) {
    setColumns((prev) =>
      prev
        ? prev.map((col, ci) => (ci === colIdx ? { ...col, ...patch } : col))
        : prev,
    );
  }

  function firstMessageContent(
    section: CompareSection,
  ): string | Array<Record<string, unknown>> {
    const text = `${buildDocumentPreamble(doc.trim() ? doc : null)}\n\n${section.prompt}`;
    if (!attachment) return text;
    return [
      { type: "text", text },
      {
        type: "file",
        file: {
          filename: attachment.name,
          file_data: `data:${attachment.mediaType};base64,${attachment.dataBase64}`,
        },
      },
    ];
  }

  async function runColumn(
    colIdx: number,
    slug: string,
    sections: CompareSection[],
    signal: AbortSignal,
  ): Promise<void> {
    let conversationId: string | undefined;
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (signal.aborted) {
        updateSection(colIdx, i, { status: "skipped" });
        continue;
      }
      updateSection(colIdx, i, { status: "streaming" });

      const content =
        i === 0 && !conversationId
          ? firstMessageContent(section)
          : `${section.prompt}\n\nApply this to the legal text and the ontology established earlier in this conversation.`;

      let res: Response;
      try {
        res = await fetch(`${AI_API_URL}/v1/chat/completions`, {
          method: "POST",
          headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          signal,
          body: JSON.stringify({
            model: `${baseName}:${slug}`,
            stream: true,
            turnId: crypto.randomUUID(),
            messages: [{ role: "user", content }],
            ...(conversationId ? { conversationId } : {}),
          }),
        });
      } catch {
        if (signal.aborted) {
          updateSection(colIdx, i, { status: "skipped" });
          continue;
        }
        updateColumn(colIdx, { fatal: "Network error — please retry." });
        updateSection(colIdx, i, { status: "error", error: "Network error" });
        for (let j = i + 1; j < sections.length; j++)
          updateSection(colIdx, j, { status: "skipped" });
        return;
      }

      if (res.status === 429) {
        updateColumn(colIdx, { limitHit: true });
        updateSection(colIdx, i, {
          status: "error",
          error: "Free usage limit reached",
        });
        for (let j = i + 1; j < sections.length; j++)
          updateSection(colIdx, j, { status: "skipped" });
        return;
      }
      if (res.status === 401) {
        updateColumn(colIdx, {
          fatal: "Your session expired — please sign in again.",
        });
        updateSection(colIdx, i, { status: "error", error: "Signed out" });
        for (let j = i + 1; j < sections.length; j++)
          updateSection(colIdx, j, { status: "skipped" });
        return;
      }
      if (!res.ok || !res.body) {
        let message = `Request failed (${res.status})`;
        try {
          const err = (await res.json()) as {
            error?: { message?: string };
          };
          if (err.error?.message) message = err.error.message;
        } catch {
          // keep the status-based message
        }
        // Section-level failure: report it but keep going — later
        // sections may still succeed on a transient upstream error.
        updateSection(colIdx, i, { status: "error", error: message });
        continue;
      }

      let sectionFailed = false;
      try {
        for await (const frame of parseSse(res.body)) {
          if (frame.data === "[DONE]") break;
          let json: Record<string, unknown>;
          try {
            json = JSON.parse(frame.data) as Record<string, unknown>;
          } catch {
            continue;
          }
          if (frame.event === "metadata") {
            const id = json.conversationId as string | undefined;
            if (id) conversationId = id;
          } else if (frame.event === "error") {
            updateSection(colIdx, i, {
              status: "error",
              error: (json.message as string) || "Upstream error",
            });
            sectionFailed = true;
            break;
          } else if (frame.event === "thinking_delta") {
            // Reasoning traces aren't part of the encoded output.
            continue;
          } else {
            const delta = (
              json.choices as
                | Array<{ delta?: { content?: string } }>
                | undefined
            )?.[0]?.delta;
            if (delta?.content) {
              const text = delta.content;
              updateSection(colIdx, i, (prev) => ({
                text: prev.text + text,
              }));
            }
          }
        }
      } catch {
        if (!signal.aborted) {
          updateSection(colIdx, i, { status: "error", error: "Stream error" });
        } else {
          updateSection(colIdx, i, { status: "skipped" });
        }
        sectionFailed = true;
      }
      if (!sectionFailed) updateSection(colIdx, i, { status: "done" });
    }
  }

  async function startRun() {
    if (running) return;
    const slugs = models.filter(Boolean);
    if (!slugs.length) return;
    setNotice(null);
    setRunning(true);
    const ac = new AbortController();
    abortRef.current = ac;
    const sections = COMPARE_SECTIONS.filter(
      (s) => s.locked || sectionIds.has(s.id),
    );
    setColumns(
      slugs.map((slug) => ({
        slug,
        limitHit: false,
        sections: sections.map((section) => ({
          section,
          status: "pending" as const,
          text: "",
        })),
      })),
    );
    try {
      await Promise.all(
        slugs.map((slug, idx) => runColumn(idx, slug, sections, ac.signal)),
      );
    } finally {
      setRunning(false);
      abortRef.current = null;
    }
  }

  // Auto-start after returning from the login redirect.
  useEffect(() => {
    if (!pendingAutorun || loading || !session || autorunFired.current) return;
    autorunFired.current = true;
    setPendingAutorun(false);
    void startRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingAutorun, loading, session]);

  function handleSubmit() {
    if (!canSubmit) return;
    if (!hasAiPermission) {
      setNotice(
        "Your account doesn't have AI chat access for this organization — ask an admin to grant the ai:chat permission.",
      );
      return;
    }
    if (!session) {
      const attachmentFits =
        !attachment ||
        attachment.dataBase64.length <= MAX_DRAFT_ATTACHMENT_CHARS;
      const draft: Draft = {
        doc,
        models,
        sections: Array.from(sectionIds),
        attachment: attachmentFits ? attachment : null,
        attachmentLost: !attachmentFits,
        autorun: true,
      };
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      } catch {
        // quota exceeded — proceed without the draft
      }
      window.location.href = `${AUTH_API_URL}/auth/login?return_to=${encodeURIComponent(
        window.location.href,
      )}`;
      return;
    }
    void startRun();
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  function handleFile(file: File) {
    setNotice(null);
    if (file.size > MAX_FILE_BYTES) {
      setNotice("File is too large — the limit is 25 MB.");
      return;
    }
    const name = file.name.toLowerCase();
    const isPdf = file.type === "application/pdf" || name.endsWith(".pdf");
    if (isPdf) {
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result ?? "");
        const base64 = url.slice(url.indexOf(",") + 1);
        setAttachment({
          name: file.name,
          mediaType: "application/pdf",
          dataBase64: base64,
        });
      };
      reader.readAsDataURL(file);
    } else {
      void file.text().then((text) => {
        setDoc((prev) => (prev.trim() ? `${prev}\n\n${text}` : text));
      });
    }
  }

  const anyLimitHit = columns?.some((c) => c.limitHit) ?? false;

  // ── UI ──────────────────────────────────────────────────────────

  return (
    <div className="space-y-8">
      {!columns && (
        <div className="text-center pt-8">
          <h1 className="text-3xl font-bold font-merriweather">Compare</h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            See how your legislation is understood by different AI models.
            Paste your legal text, pick up to three models, and compare their
            formal encodings side by side.
          </p>
        </div>
      )}

      {/* ── Prompt card ── */}
      <div
        className={
          columns
            ? "bg-white border border-gray-200 rounded-lg p-4"
            : "bg-white border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto shadow-sm"
        }
      >
        <textarea
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          rows={columns ? 3 : 10}
          placeholder="Paste your legal text here — legislation, regulation or contract…"
          className="w-full resize-y rounded-md border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md,application/pdf,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md px-3 py-1.5 transition-colors"
          >
            Upload PDF / TXT / MD
          </button>
          {attachment && (
            <span className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded-full px-3 py-1">
              {attachment.name}
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="text-gray-400 hover:text-gray-700 ml-1"
                aria-label="Remove attachment"
              >
                ✕
              </button>
            </span>
          )}
        </div>

        {/* ── Model + section pickers ── */}
        <div className="mt-4 flex flex-wrap items-end gap-3">
          {[0, 1, 2].map((i) => (
            <label key={i} className="block">
              <span className="block text-xs text-gray-500 mb-1">
                {i === 0 ? "Model" : `Model ${i + 1} (optional)`}
              </span>
              <select
                value={models[i]}
                onChange={(e) =>
                  setModels((prev) =>
                    prev.map((m, mi) => (mi === i ? e.target.value : m)),
                  )
                }
                className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm max-w-[220px]"
              >
                {i > 0 && <option value="">None</option>}
                {available.map((slug) => (
                  <option
                    key={slug}
                    value={slug}
                    disabled={models.some((m, mi) => mi !== i && m === slug)}
                  >
                    {slugLabel(slug)} · {slugProvider(slug)}
                  </option>
                ))}
              </select>
            </label>
          ))}

          <div className="relative">
            <span className="block text-xs text-gray-500 mb-1">Sections</span>
            <button
              type="button"
              onClick={() => setSectionsOpen((o) => !o)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm"
            >
              {selectedSections.length} of {COMPARE_SECTIONS.length} selected ▾
            </button>
            {sectionsOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSectionsOpen(false)}
                />
                <div className="absolute z-20 mt-1 w-64 rounded-md border border-gray-200 bg-white shadow-lg p-2">
                  {COMPARE_SECTIONS.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm ${
                        s.locked
                          ? "text-gray-400"
                          : "hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={s.locked || sectionIds.has(s.id)}
                        disabled={s.locked}
                        onChange={(e) =>
                          setSectionIds((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(s.id);
                            else next.delete(s.id);
                            return next;
                          })
                        }
                      />
                      {s.title}
                      {s.locked && (
                        <span className="text-[10px] uppercase tracking-wide">
                          required
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="ml-auto flex gap-2">
            {running && (
              <button
                type="button"
                onClick={handleStop}
                className="rounded-md border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900"
              >
                Stop
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-md bg-gray-900 px-5 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {running ? "Comparing…" : "Compare"}
            </button>
          </div>
        </div>

        {notice && <p className="mt-3 text-sm text-amber-700">{notice}</p>}
        {!loading && !session && (
          <p className="mt-3 text-xs text-gray-400">
            You&apos;ll be asked to sign in when you press Compare.
          </p>
        )}
      </div>

      {/* ── Upgrade banner ── */}
      {anyLimitHit && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900">
          You&apos;ve reached the free limit of AI credits for today.{" "}
          <Link
            href="/console/billing/upgrade/metered"
            className="font-medium underline hover:no-underline"
          >
            Upgrade to the metered plan
          </Link>{" "}
          to keep comparing.
        </div>
      )}

      {/* ── Result columns ── */}
      {columns && (
        <div
          className={`grid gap-4 items-start grid-cols-1 ${
            columns.length === 2
              ? "md:grid-cols-2"
              : columns.length >= 3
                ? "md:grid-cols-3"
                : ""
          }`}
        >
          {columns.map((col) => (
            <div
              key={col.slug}
              className="bg-white border border-gray-200 rounded-lg min-w-0"
            >
              <div className="border-b border-gray-200 px-4 py-3">
                <div className="font-semibold text-sm">
                  {slugLabel(col.slug)}
                </div>
                <div className="text-xs text-gray-400">{col.slug}</div>
              </div>
              {col.fatal && (
                <div className="px-4 py-3 text-sm text-red-600">
                  {col.fatal}
                </div>
              )}
              {col.limitHit && (
                <div className="px-4 py-3 text-sm text-amber-800 bg-amber-50 border-b border-amber-100">
                  Stopped — free AI credit limit reached.{" "}
                  <Link
                    href="/console/billing/upgrade/metered"
                    className="font-medium underline hover:no-underline"
                  >
                    Upgrade
                  </Link>
                </div>
              )}
              <div className="divide-y divide-gray-100">
                {col.sections.map((run, i) => (
                  <div key={run.section.id} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {i + 1}. {run.section.title}
                      </span>
                      {run.status === "pending" && (
                        <span className="text-xs text-gray-300">waiting…</span>
                      )}
                      {run.status === "streaming" && (
                        <span className="text-xs text-accent animate-pulse">
                          writing…
                        </span>
                      )}
                      {run.status === "skipped" && (
                        <span className="text-xs text-gray-300">skipped</span>
                      )}
                    </div>
                    {run.status === "error" ? (
                      <p className="text-sm text-red-600">{run.error}</p>
                    ) : (
                      run.status !== "pending" &&
                      run.status !== "skipped" && <SectionBody run={run} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
