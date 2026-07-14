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
  // `~vendor/model-latest` are OpenRouter floating aliases; the column
  // header shows the concrete model each turn was actually served by.
  "~anthropic/claude-sonnet-latest",
  "~anthropic/claude-opus-latest",
  "~openai/gpt-latest",
  "~google/gemini-flash-latest",
  "~x-ai/grok-latest",
  "z-ai/glm-5.2",
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
  /**
   * Concrete upstream model ids that actually served this column's
   * requests, as reported by the proxy's `servedModel` metadata frames.
   * Matters because the "-latest" aliases float; usually one entry, but
   * an alias can roll over mid-run.
   */
  servedModels: string[];
}

interface Draft {
  doc: string;
  models: string[];
  sections: string[];
  attachment: Attachment | null;
  attachmentLost: boolean;
  autorun: boolean;
}

/** All-caps model-family acronyms for display labels. */
const ACRONYMS = new Set(["gpt", "glm"]);

/** "~anthropic/claude-opus-latest" → "Claude Opus Latest"; "z-ai/glm-5.2" → "GLM 5.2" */
function slugLabel(rawSlug: string): string {
  const slug = rawSlug.replace(/^~/, "");
  const name = slug.includes("/") ? slug.slice(slug.indexOf("/") + 1) : slug;
  return name
    .split("-")
    .map((w) =>
      ACRONYMS.has(w.toLowerCase())
        ? w.toUpperCase()
        : /^\d/.test(w)
          ? w
          : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");
}

function slugProvider(rawSlug: string): string {
  const slug = rawSlug.replace(/^~/, "");
  return slug.includes("/") ? slug.slice(0, slug.indexOf("/")) : "";
}

/** First non-empty line of the pasted text, for the results header bar. */
function docPreview(doc: string): string {
  const firstLine =
    doc
      .trim()
      .split("\n")
      .find((l) => l.trim()) ?? "";
  if (!firstLine) return "Untitled comparison";
  return firstLine.length > 140 ? `${firstLine.slice(0, 140)}…` : firstLine;
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

/** Gap between markdown render passes while a section streams. */
const MARKDOWN_RENDER_INTERVAL_MS = 300;

/** True when `s` ends inside an unclosed ``` / ~~~ code fence. */
function fenceOpen(s: string): boolean {
  const fences = s.match(/^(?:```|~~~)/gm);
  return fences !== null && fences.length % 2 === 1;
}

function SectionBody({ run }: { run: SectionRun }) {
  const [html, setHtml] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const streaming = run.status === "streaming";
  const text = run.text;

  // Latest text, readable from the interval below without re-arming
  // any effect on every token.
  const textRef = useRef(text);
  textRef.current = text;

  // Incremental-render cache: HTML for text[0..stableLen), built from
  // completed paragraph blocks that were each parsed exactly once.
  const stableHtml = useRef("");
  const stableLen = useRef(0);
  const inFlight = useRef(false);

  // Streaming: one interval per streaming section (at most one section
  // streams per column, so ≤3 timers page-wide). Each tick parses only
  // what's new — completed blocks (up to the last blank line that isn't
  // inside an open code fence) are parsed once and appended to the
  // cached HTML; only the small unfinished tail is re-parsed per tick.
  // Cross-block constructs that a blank line would split (tables,
  // fences) stay in the tail until complete, so they render intact.
  useEffect(() => {
    if (!streaming) return;
    let disposed = false;

    const tick = async () => {
      if (disposed || inFlight.current) return;
      inFlight.current = true;
      try {
        const t = textRef.current;
        const pending = t.slice(stableLen.current);
        // Furthest blank-line boundary that keeps fences balanced.
        let boundary = pending.lastIndexOf("\n\n");
        while (boundary > 0 && fenceOpen(pending.slice(0, boundary))) {
          boundary = pending.lastIndexOf("\n\n", boundary - 1);
        }
        if (boundary > 0) {
          const flushed = pending.slice(0, boundary + 2);
          const h = await markdownToHtml(flushed);
          if (disposed) return;
          stableHtml.current += h;
          stableLen.current += flushed.length;
        }
        const tailHtml = await markdownToHtml(t.slice(stableLen.current));
        if (!disposed) setHtml(stableHtml.current + tailHtml);
      } finally {
        inFlight.current = false;
      }
    };

    void tick();
    const interval = setInterval(() => void tick(), MARKDOWN_RENDER_INTERVAL_MS);
    return () => {
      disposed = true;
      clearInterval(interval);
    };
  }, [streaming]);

  // Not streaming (done, or error with partial text): one authoritative
  // full-document parse — fixes any seams the incremental preview left
  // (e.g. a list split across flush boundaries).
  useEffect(() => {
    if (streaming) return;
    let alive = true;
    void markdownToHtml(text).then((h) => {
      if (!alive) return;
      stableHtml.current = h;
      stableLen.current = text.length;
      setHtml(h);
    });
    return () => {
      alive = false;
    };
  }, [streaming, text]);

  // Keep the view pinned to the newest content while streaming — but
  // only when the user is already near the bottom, so scrolling up to
  // read doesn't fight the autoscroll.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !streaming) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) el.scrollTop = el.scrollHeight;
  }, [html, streaming]);

  return (
    // The generated output sits on a subtly tinted panel so model text
    // reads as output, distinct from the white page chrome around it.
    <div
      ref={scrollRef}
      className="max-h-[85vh] overflow-y-auto bg-gray-50 rounded-md p-3"
    >
      {html ? (
        <div
          className={MARKDOWN_CLASS}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-800">
          {text}
        </div>
      )}
      {streaming && (
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
            const served = json.servedModel as string | undefined;
            if (served) {
              setColumns((prev) =>
                prev
                  ? prev.map((col, ci) =>
                      ci === colIdx && !col.servedModels.includes(served)
                        ? {
                            ...col,
                            servedModels: [...col.servedModels, served],
                          }
                        : col,
                    )
                  : prev,
              );
            }
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
        servedModels: [],
        sections: sections.map((section) => ({
          section,
          status: "pending" as const,
          text: "",
        })),
      })),
    );
    // The results view gets its own history entry so browser-back
    // returns to the input form (confirm-guarded while generating)
    // instead of leaving the page. The popstate handler below unwinds it.
    window.history.pushState({ compareResults: true }, "");
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

  // Abort any in-flight generation and return to the input form. The
  // form state (doc, models, sections) is preserved for editing.
  function exitResults() {
    abortRef.current?.abort();
    setColumns(null);
  }

  // Browser-back from the results view. While a run is generating,
  // leaving cancels it — double-check with the user and re-push the
  // history entry if they decline.
  useEffect(() => {
    function onPopState() {
      if (columns === null) return;
      if (
        running &&
        !window.confirm(
          "Going back will cancel the comparison that is still generating. Cancel it?",
        )
      ) {
        window.history.pushState({ compareResults: true }, "");
        return;
      }
      exitResults();
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, running]);

  // The Back button routes through history.back() so the popstate
  // handler above owns the confirm-and-cleanup in one place.
  function handleBack() {
    window.history.back();
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
          <h1 className="text-3xl font-bold font-merriweather">Compare AI Legal Interpretations</h1>
          <p className="mt-3 text-gray-600 max-w-xl mx-auto">
            See how your legislation is understood by different AI models.
            Paste your legal text, pick up to three models, and compare their
            formal encodings side by side.
          </p>
        </div>
      )}

      {/* ── Results header bar: doc identity + back ── */}
      {columns && (
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5">
          <button
            type="button"
            onClick={handleBack}
            className="shrink-0 rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">
              {attachment ? attachment.name : docPreview(doc)}
            </div>
            {attachment && doc.trim() !== "" && (
              <div className="text-xs text-gray-400 truncate">
                {docPreview(doc)}
              </div>
            )}
          </div>
          <span
            className={`shrink-0 text-sm ${
              running ? "text-accent animate-pulse" : "text-gray-400"
            }`}
          >
            {running ? "Comparing…" : "Done"}
          </span>
        </div>
      )}

      {/* ── Prompt card (input view only) ── */}
      {!columns && (
      <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-3xl mx-auto shadow-sm">
        <textarea
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          rows={10}
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
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-md bg-accent px-5 py-1.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Compare
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
      )}

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

      {/* ── Results — section-major: one collapsible header per section
             (kept on the page background), each opening an edge-to-edge
             multi-column grid of model outputs ── */}
      {columns && (
        <div className="mx-[calc(50%-50vw)]">
          {/* Sticky model-name row: 61px tall (20 + 16 text lines + 2×12
              padding + 1 border) — the section headers pin underneath at
              md:top-[61px]. Hidden on mobile, where the stacked cells
              carry their own model label. A column's fatal / limit note
              replaces its resolved-model line so the row height stays
              fixed. */}
          <div
            className={`hidden md:grid sticky top-0 z-20 bg-white border-b border-gray-100 divide-x divide-gray-200 ${
              columns.length === 2
                ? "md:grid-cols-2"
                : columns.length >= 3
                  ? "md:grid-cols-3"
                  : ""
            }`}
          >
            {columns.map((col) => (
              <div key={col.slug} className="min-w-0 px-4 py-3">
                <div className="font-semibold text-sm truncate">
                  {slugLabel(col.slug)}
                </div>
                <div
                  className={`text-xs truncate ${
                    col.fatal
                      ? "text-red-600"
                      : col.limitHit
                        ? "text-amber-700"
                        : "text-gray-500"
                  }`}
                >
                  {col.fatal
                    ? col.fatal
                    : col.limitHit
                      ? "stopped — free AI credit limit reached"
                      : col.servedModels.length > 0
                        ? col.servedModels.join(", ")
                        : "resolving model…"}
                </div>
              </div>
            ))}
          </div>

          {columns[0].sections.map((first, i) => {
            const section = first.section;
            const runs = columns.map((col) => col.sections[i]);
            const anyStreaming = runs.some((r) => r.status === "streaming");
            const allPending = runs.every((r) => r.status === "pending");
            return (
              <details key={section.id} open className="group">
                <summary className="sticky top-0 md:top-[61px] z-10 bg-gray-50 flex items-center gap-2 px-4 py-2.5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-[10px] text-gray-400 transition-transform group-open:rotate-90">
                    ▶
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {i + 1}. {section.title}
                  </span>
                  {allPending && (
                    <span className="text-xs text-gray-300">waiting…</span>
                  )}
                  {anyStreaming && (
                    <span className="text-xs text-accent animate-pulse">
                      writing…
                    </span>
                  )}
                </summary>
                <div
                  className={`grid items-start bg-white divide-y divide-gray-200 md:divide-y-0 md:divide-x grid-cols-1 ${
                    columns.length === 2
                      ? "md:grid-cols-2"
                      : columns.length >= 3
                        ? "md:grid-cols-3"
                        : ""
                  }`}
                >
                  {runs.map((run, ci) => (
                    <div key={columns[ci].slug} className="min-w-0 px-4 py-3">
                      <div className="md:hidden text-xs font-medium text-gray-500 mb-1">
                        {slugLabel(columns[ci].slug)}
                      </div>
                      {run.status === "error" ? (
                        <p className="text-sm text-red-600">{run.error}</p>
                      ) : run.status === "pending" ? (
                        <p className="text-xs text-gray-300">waiting…</p>
                      ) : run.status === "skipped" ? (
                        <p className="text-xs text-gray-300">skipped</p>
                      ) : (
                        <SectionBody run={run} />
                      )}
                    </div>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      )}
    </div>
  );
}
