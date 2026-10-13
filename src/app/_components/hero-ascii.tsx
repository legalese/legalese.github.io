"use client";

import { useEffect, useRef } from "react";

// System monospace only: no font download, and the grid is measured at runtime
const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// gray-900, accent and accent-hover from tailwind.config.ts, plus a muted
// teal and purple that only tint the L4 code
const COLORS = {
  ink: "rgb(17, 24, 39)",
  accent: "rgb(200, 55, 106)",
  deep: "rgb(122, 40, 57)",
  teal: "rgb(58, 122, 128)",
  purple: "rgb(120, 98, 152)",
};

const S = {
  FAINT: 0,
  MID: 1,
  TEAL: 2,
  ACC_SOFT: 3,
  ACC: 4,
  ACC_BOLD: 5,
  DEEP_SOFT: 6,
  DEEP: 7,
  PURPLE: 8,
  PURPLE_SOFT: 9,
};

const STYLES: { color: keyof typeof COLORS; alpha: number; weight: number }[] = [
  { color: "ink", alpha: 0.3, weight: 400 },
  { color: "ink", alpha: 0.52, weight: 400 },
  { color: "teal", alpha: 0.95, weight: 500 },
  { color: "accent", alpha: 0.5, weight: 400 },
  { color: "accent", alpha: 1, weight: 500 },
  { color: "accent", alpha: 1, weight: 600 },
  { color: "deep", alpha: 0.6, weight: 400 },
  { color: "deep", alpha: 1, weight: 600 },
  { color: "purple", alpha: 1, weight: 500 },
  { color: "purple", alpha: 0.9, weight: 400 },
];

const KEYWORDS = new Set(
  (
    "GIVEN GIVETH DECIDE DECLARE IF THEN ELSE AND OR NOT MEANS IS A AN HAS ONE OF PARTY MUST MAY SHANT " +
    "WITHIN HENCE LEST WHERE CONSIDER WHEN OTHERWISE TRUE FALSE FULFILLED EXACTLY PROVIDED"
  ).split(" ")
);
const TYPES = new Set(["BOOLEAN", "NUMBER", "STRING"]);

// Each clause of legal prose is laid out over the L4 rule it turns into
const CLAUSES = [
  {
    prose:
      "3.1 A person shall be eligible to apply under this Part if, and only if, that person (a) has attained the age of twenty-one years or holds an exemption granted by the Minister; (b) is in possession of valid identification; and (c) has not been disqualified under section 9.",
    code: [
      "§ Eligibility",
      "",
      "GIVEN applicant IS A Person",
      "GIVETH A BOOLEAN",
      "DECIDE `is eligible` IF",
      "        applicant's `has valid ID`",
      "    AND NOT `is disqualified` applicant",
      "    AND    applicant's age >= 21",
      "        OR `holds an exemption` applicant",
    ],
  },
  {
    prose:
      "7.2 The Borrower shall repay the Loan within thirty (30) days after the Maturity Date, failing which the Borrower shall, within ten (10) days of written demand by the Lender, pay the principal together with a penalty of five per cent thereof, and all outstanding sums shall become immediately due and payable.",
    code: [
      "§ Repayment",
      "",
      "`the loan agreement` MEANS",
      "  PARTY Borrower",
      "  MUST repay principal",
      "  WITHIN 30",
      "  HENCE FULFILLED",
      "  LEST",
      "    PARTY Borrower",
      "    MUST EXACTLY repay (principal + penalty)",
      "    WITHIN 10",
      "  WHERE",
      "    penalty MEANS principal * 0.05",
    ],
  },
  {
    prose:
      "33D. (1) Where a dog attacks a person or an animal and the dog is a dangerous dog within the meaning of this Act, the owner of the dog shall be guilty of an offence and shall be liable on conviction to a fine not exceeding $10,000, or in any other case to a fine not exceeding $5,000.",
    code: [
      "§ `Maximum fine`",
      "",
      "GIVEN incident IS AN Incident",
      "GIVETH A NUMBER",
      "`the maximum fine` incident MEANS",
      "    IF `the dog is a dangerous dog` incident",
      "    THEN 10000",
      "    ELSE 5000",
    ],
  },
  {
    prose:
      "11. Either party may terminate this Agreement by giving the other party notice in writing of not less than (i) one day, where the Employee has been employed for less than twenty-six weeks; (ii) one week, where the Employee has been employed for less than two years; and (iii) four weeks in any other case.",
    code: [
      "§ `Notice period`",
      "",
      "GIVEN weeks IS A NUMBER",
      "GIVETH A NUMBER",
      "`notice period in days` weeks MEANS",
      "    IF      weeks < 26  THEN 1",
      "    ELSE IF weeks < 104 THEN 7",
      "    ELSE 28",
    ],
  },
  {
    prose:
      "6. Processing shall be lawful only if and to the extent that at least one of the following applies: (a) the data subject has given consent to the processing; (b) processing is necessary for the performance of a contract to which the data subject is party; (c) processing is necessary for compliance with a legal obligation to which the controller is subject.",
    code: [
      "§ `Lawfulness of processing`",
      "",
      "GIVEN p IS A Processing",
      "GIVETH A BOOLEAN",
      "DECIDE `processing is lawful` IF",
      "       p's `consent was given`",
      "    OR p's `is necessary for a contract`",
      "    OR p's `is required by law`",
    ],
  },
  {
    prose:
      "1(b) Liquidity Event. If there is a Liquidity Event before the termination of this Safe, the Investor will automatically be entitled to receive a portion of Proceeds equal to the greater of (i) the Purchase Amount (the Cash-Out Amount) or (ii) the amount payable on the number of shares of Common Stock equal to the Purchase Amount divided by the Liquidity Price (the Conversion Amount).",
    code: [
      "§ `Liquidity Event`",
      "",
      "DECLARE Safe",
      "    HAS `purchase amount` IS A NUMBER",
      "        `liquidity price` IS A NUMBER",
      "",
      "GIVEN safe  IS A Safe",
      "      price IS A NUMBER",
      "GIVETH A NUMBER",
      "`liquidity payout` MEANS",
      "    IF `conversion` > `cash-out` THEN `conversion`",
      "    ELSE `cash-out`",
      "    WHERE",
      "      `cash-out` MEANS safe's `purchase amount`",
      "      `conversion` MEANS",
      "          safe's `purchase amount`",
      "            / safe's `liquidity price` * price",
    ],
  },
];

const FILLER = [
  "NOTWITHSTANDING the foregoing, no failure or delay by either party in exercising any right hereunder shall operate as a waiver thereof.",
  "Words importing the singular include the plural and vice versa, and references to any enactment include that enactment as amended or re-enacted from time to time.",
  "For the avoidance of doubt, the provisions of this section shall survive termination howsoever arising, SAVE AS expressly provided herein.",
  "Any notice required to be given shall be in writing and shall be deemed duly served if delivered by hand or sent by registered post to the address of the party concerned.",
  "Nothing in this clause shall be construed so as to limit or exclude any liability which cannot lawfully be limited or excluded, PROVIDED THAT the parties act in good faith.",
];

const SCRAMBLE = "§¶#%&$@/\\|<>{}[]()=+*;:01";

const CYCLE = 21; // seconds: prose, eaten into code, held, cleared
const SCRAMBLE_FOR = 0.6;
const STILL_AT = 9.5; // the frame shown under prefers-reduced-motion

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function hash2(x: number, y: number) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function hash3(x: number, y: number, z: number) {
  let h =
    Math.imul(x | 0, 374761393) ^
    Math.imul(y | 0, 668265263) ^
    Math.imul(z | 0, 1440662683);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function valueNoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const a = hash3(xi, yi, zi), b = hash3(xi + 1, yi, zi);
  const c = hash3(xi, yi + 1, zi), d = hash3(xi + 1, yi + 1, zi);
  const e = hash3(xi, yi, zi + 1), f = hash3(xi + 1, yi, zi + 1);
  const g = hash3(xi, yi + 1, zi + 1), h = hash3(xi + 1, yi + 1, zi + 1);
  return lerp(
    lerp(lerp(a, b, u), lerp(c, d, u), v),
    lerp(lerp(e, f, u), lerp(g, h, u), v),
    w
  );
}

function fbm(x: number, y: number, z: number) {
  return (
    valueNoise(x, y, z) * 0.6 +
    valueNoise(x * 2.1 + 7.3, y * 2.1 + 1.7, z + 3.1) * 0.3 +
    valueNoise(x * 4.3 + 3.1, y * 4.3 + 9.2, z + 6.7) * 0.1
  );
}

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(a: T[], rng: () => number) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = (rng() * (i + 1)) | 0;
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function wrap(text: string, width: number) {
  const lines: string[] = [];
  let cur = "";
  for (const word of text.split(/\s+/)) {
    if (!cur) cur = word;
    else if (cur.length + 1 + word.length <= width) cur += " " + word;
    else {
      lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function justify(line: string, width: number) {
  const words = line.split(" ");
  let extra = width - line.length;
  if (words.length < 2 || extra <= 0 || extra > width * 0.4) return line;
  const gaps = words.length - 1;
  let out = "";
  for (let i = 0; i < words.length; i++) {
    out += words[i];
    if (i < gaps) {
      const add = Math.ceil(extra / (gaps - i));
      out += " ".repeat(1 + add);
      extra -= add;
    }
  }
  return out;
}

function styleCode(line: string) {
  const out = new Uint8Array(line.length).fill(S.MID);
  if (/^\s*§/.test(line)) return out.fill(S.DEEP);
  const re = /`[^`]*`|\b[A-Z]+\b|\b[A-Z][a-z]+\b|\b\d+(?:\.\d+)?\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const tok = m[0];
    let s = -1;
    if (tok[0] === "`") s = S.TEAL;
    else if (tok[0] >= "0" && tok[0] <= "9") s = S.DEEP_SOFT;
    else if (TYPES.has(tok)) s = S.PURPLE;
    else if (KEYWORDS.has(tok)) s = S.ACC;
    // Capitalised names are types and parties
    else if (/^[A-Z][a-z]+$/.test(tok)) s = S.PURPLE_SOFT;
    if (s >= 0) out.fill(s, m.index, m.index + tok.length);
  }
  return out;
}

const CODE_STYLES = CLAUSES.map((clause) => clause.code.map(styleCode));

/**
 * Fills the canvas' parent with a character grid in which a wall of legal
 * prose is eaten from the edges in and comes out as L4. Returns a cleanup.
 */
function startHeroAscii(canvas: HTMLCanvasElement) {
  const stage = canvas.parentElement;
  const ctx = canvas.getContext("2d");
  if (!stage || !ctx) return () => {};

  const copyEl = stage.querySelector<HTMLElement>("[data-hero-copy]");
  const headerEl = stage.querySelector<HTMLElement>("header");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let W = 0, H = 0, dpr = 1, fontSize = 14, cw = 8.4, ch = 21, cols = 0, rows = 0;
  let maskH: CanvasGradient | null = null;
  let maskV: CanvasGradient | null = null;

  // What is on screen this frame
  let chars = new Uint16Array(0);
  let styles = new Uint8Array(0);
  // The two layers of the current cycle, and when each cell gets eaten
  let prose = new Uint16Array(0);
  let proseStyle = new Uint8Array(0);
  let code = new Uint16Array(0);
  let codeStyle = new Uint8Array(0);
  let eatAt = new Float32Array(0);
  let cycle = -1;

  const pointer = { x: 0, y: 0, on: false };
  let time = reduceMotion.matches ? STILL_AT : 0;
  let last = 0;
  let raf = 0;
  let visible = true;

  function measure() {
    const rect = stage!.getBoundingClientRect();
    const w = Math.round(rect.width), h = Math.round(rect.height);
    if (w < 10 || h < 10) return;

    W = w;
    H = h;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    fontSize = W < 360 ? 10 : W < 560 ? 11 : W < 1100 ? 12.5 : 14;
    ctx!.font = `400 ${fontSize}px ${MONO}`;
    const m = ctx!.measureText("MMMMMMMMMMMMMMMMMMMM").width / 20;
    cw = m > 2 ? m : fontSize * 0.6;
    ch = Math.round(fontSize * 1.5);

    const nextCols = Math.ceil(W / cw), nextRows = Math.ceil(H / ch);
    if (nextCols !== cols || nextRows !== rows) {
      cols = nextCols;
      rows = nextRows;
      chars = new Uint16Array(cols * rows);
      styles = new Uint8Array(cols * rows);
      cycle = -1;
    }

    // The glyphs themselves fade where the header and the copy sit, and out
    // at the bottom edge. Beside the copy on wide screens, below it on narrow.
    const copy = copyEl?.getBoundingClientRect();
    const copyRight = copy ? copy.right - rect.left : 0;
    const copyBottom = copy ? copy.bottom - rect.top : 0;
    const headerBottom = headerEl ? headerEl.getBoundingClientRect().bottom - rect.top : 0;
    const dim = (a: number) => `rgba(0,0,0,${a})`;
    const stacked = copyRight > W * 0.7;

    if (!stacked) {
      const a = clamp((copyRight - 60) / W, 0.02, 0.9);
      const b = clamp((copyRight + 50) / W, a + 0.02, 0.98);
      maskH = ctx!.createLinearGradient(0, 0, W, 0);
      maskH.addColorStop(0, dim(0.15));
      maskH.addColorStop(a, dim(0.15));
      maskH.addColorStop(b, dim(1));
      maskH.addColorStop(1, dim(1));

      const p = clamp(headerBottom / H, 0.02, 0.4);
      const q = clamp((headerBottom + 80) / H, p + 0.02, 0.6);
      maskV = ctx!.createLinearGradient(0, 0, 0, H);
      maskV.addColorStop(0, dim(0.05));
      maskV.addColorStop(p, dim(0.1));
      maskV.addColorStop(q, dim(1));
      maskV.addColorStop(0.86, dim(1));
      maskV.addColorStop(1, dim(0));
    } else {
      const a = clamp((copyBottom - 10) / H, 0.05, 0.8);
      const b = clamp((copyBottom + 40) / H, a + 0.02, 0.9);
      maskH = null;
      maskV = ctx!.createLinearGradient(0, 0, 0, H);
      maskV.addColorStop(0, dim(0.13));
      maskV.addColorStop(a, dim(0.13));
      maskV.addColorStop(b, dim(1));
      maskV.addColorStop(0.93, dim(1));
      maskV.addColorStop(1, dim(0));
    }
  }

  function layout(k: number) {
    cycle = k;
    const n = cols * rows;
    const rng = mulberry(1013 + k * 7919);
    prose = new Uint16Array(n);
    proseStyle = new Uint8Array(n);
    code = new Uint16Array(n);
    codeStyle = new Uint8Array(n);

    const gutter = 5;
    const columns = Math.max(1, Math.floor((cols + 1) / (52 + gutter)));
    const colW = Math.max(20, Math.min(64, Math.floor((cols + 1) / columns) - gutter));
    const used = columns * colW + (columns - 1) * gutter;
    const left = Math.max(1, Math.floor((cols - used) / 2));

    for (let j = 0; j < columns; j++) {
      const ox = left + j * (colW + gutter);
      const order = shuffle(CLAUSES.map((_, i) => i), rng);
      let next = 0;
      let y = -((rng() * 5) | 0);
      while (y < rows) {
        const ci = order[next++ % order.length];
        const clause = CLAUSES[ci];
        // Pad the clause with boilerplate until it covers its rule
        let text = clause.prose;
        let lines = wrap(text, colW);
        let fi = (rng() * FILLER.length) | 0;
        while (lines.length < clause.code.length) {
          text += " " + FILLER[fi++ % FILLER.length];
          lines = wrap(text, colW);
        }
        for (let i = 0; i < lines.length; i++) {
          const r = y + i;
          if (r < 0 || r >= rows) continue;
          const line = i < lines.length - 1 ? justify(lines[i], colW) : lines[i];
          let p = 0;
          while (p < line.length) {
            if (line.charCodeAt(p) <= 32) {
              p++;
              continue;
            }
            let e = p;
            while (e < line.length && line.charCodeAt(e) > 32) e++;
            // All-caps terms of art read a touch darker
            const st = /^[A-Z]{2,}[,;:.]?$/.test(line.slice(p, e)) ? S.MID : S.FAINT;
            for (let q = p; q < e && q < colW; q++) {
              const c = ox + q;
              if (c < cols) {
                prose[r * cols + c] = line.charCodeAt(q);
                proseStyle[r * cols + c] = st;
              }
            }
            p = e;
          }
          if (i < clause.code.length) {
            const codeLine = clause.code[i];
            const lineStyle = CODE_STYLES[ci][i];
            for (let q = 0; q < codeLine.length && q < colW; q++) {
              const c = ox + q;
              const cc = codeLine.charCodeAt(q);
              if (cc > 32 && c < cols) {
                code[r * cols + c] = cc;
                codeStyle[r * cols + c] = lineStyle[q];
              }
            }
          }
        }
        y += lines.length + 1;
      }
    }

    // Eating order: noise islands with a drift, rank-normalised so the eaten
    // area grows at an even pace
    const vals = new Float32Array(n);
    const angle = k === 0 ? 0 : rng() * Math.PI * 2;
    const ux = Math.cos(angle), uy = Math.sin(angle);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const along = (c / cols - 0.5) * ux + (r / rows - 0.5) * uy + 0.5;
        vals[r * cols + c] = fbm(c * 0.05, r * 0.12, k * 3.7 + 0.5) - along * 0.55;
      }
    }
    const order = new Uint32Array(n);
    for (let i = 0; i < n; i++) order[i] = i;
    order.sort((a, b) => vals[a] - vals[b]);
    eatAt = new Float32Array(n);
    const start = k === 0 ? 1.2 : 2.6;
    for (let j = 0; j < n; j++) eatAt[order[j]] = start + (j / n) * 11;
  }

  function draw(t: number) {
    const k = Math.floor(t / CYCLE);
    if (k !== cycle) layout(k);
    const u = t - k * CYCLE;
    const n = cols * rows;

    // The pointer takes a bite
    if (pointer.on) {
      const R = 95;
      const c0 = Math.max(0, Math.floor((pointer.x - R) / cw));
      const c1 = Math.min(cols - 1, Math.ceil((pointer.x + R) / cw));
      const r0 = Math.max(0, Math.floor((pointer.y - R) / ch));
      const r1 = Math.min(rows - 1, Math.ceil((pointer.y + R) / ch));
      for (let r = r0; r <= r1; r++) {
        for (let c = c0; c <= c1; c++) {
          const dx = (c + 0.5) * cw - pointer.x, dy = (r + 0.5) * ch - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            const i = r * cols + c;
            const at = u + (Math.sqrt(d2) / R) * 0.3;
            if (eatAt[i] > at) eatAt[i] = at;
          }
        }
      }
    }

    const typing = k > 0 && u < 1.6;
    const gone = clamp((u - (CYCLE - 1.3)) / 1.3, 0, 1);
    const tick = Math.floor(u * 16);
    for (let i = 0; i < n; i++) {
      const dt = u - eatAt[i];
      if (dt < 0) {
        const p = prose[i];
        if (p <= 32) continue;
        if (typing) {
          const r = (i / cols) | 0;
          if (u < ((r + hash2(i, 5) * 6) / (rows + 6)) * 1.5) continue;
        }
        chars[i] = p;
        styles[i] = proseStyle[i];
      } else if (dt < SCRAMBLE_FOR) {
        const cc = code[i];
        if (prose[i] <= 32 && cc <= 32) continue;
        const h = hash3(i, tick, 7);
        if (cc <= 32 && dt > SCRAMBLE_FOR * 0.5 && h < 0.55) continue;
        chars[i] = SCRAMBLE.charCodeAt((h * SCRAMBLE.length) | 0);
        styles[i] = dt < 0.16 ? S.ACC_BOLD : dt < SCRAMBLE_FOR * 0.65 ? S.ACC : S.ACC_SOFT;
      } else {
        const cc = code[i];
        if (cc <= 32) continue;
        if (gone > 0 && hash2(i, 91) < gone * 1.05) continue;
        chars[i] = cc;
        styles[i] = dt < SCRAMBLE_FOR + 0.9 ? S.DEEP : gone > 0.35 ? S.FAINT : codeStyle[i];
      }
    }
  }

  function paint() {
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx!.globalCompositeOperation = "source-over";
    ctx!.globalAlpha = 1;
    ctx!.clearRect(0, 0, W, H);
    ctx!.textBaseline = "middle";
    ctx!.textAlign = "left";

    // One pass per style, drawing each word as a single run
    for (let s = 0; s < STYLES.length; s++) {
      const st = STYLES[s];
      let began = false;
      for (let r = 0; r < rows; r++) {
        const o = r * cols;
        const y = r * ch + ch / 2;
        let c = 0;
        while (c < cols) {
          const i = o + c;
          if (chars[i] > 32 && styles[i] === s) {
            let e = c + 1;
            while (e < cols && chars[o + e] > 32 && styles[o + e] === s) e++;
            if (!began) {
              ctx!.font = `${st.weight} ${fontSize}px ${MONO}`;
              ctx!.fillStyle = COLORS[st.color];
              ctx!.globalAlpha = st.alpha;
              began = true;
            }
            ctx!.fillText(String.fromCharCode(...chars.subarray(i, o + e)), c * cw, y);
            c = e;
          } else c++;
        }
      }
    }

    ctx!.globalAlpha = 1;
    ctx!.globalCompositeOperation = "destination-in";
    if (maskH) {
      ctx!.fillStyle = maskH;
      ctx!.fillRect(0, 0, W, H);
    }
    if (maskV) {
      ctx!.fillStyle = maskV;
      ctx!.fillRect(0, 0, W, H);
    }
    ctx!.globalCompositeOperation = "source-over";
  }

  function render() {
    if (!cols || !rows) return;
    chars.fill(0);
    draw(time);
    paint();
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    if (!visible) {
      last = now;
      return;
    }
    const elapsed = now - last;
    if (elapsed < 31) return; // ~30fps is plenty for text
    last = now;
    time += Math.min(0.1, elapsed / 1000);
    render();
  }

  function play() {
    cancelAnimationFrame(raf);
    if (reduceMotion.matches) {
      time = STILL_AT;
      render();
    } else {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  let pendingMeasure = 0;
  function queueMeasure() {
    if (pendingMeasure) return;
    pendingMeasure = requestAnimationFrame(() => {
      pendingMeasure = 0;
      measure();
      render();
    });
  }

  function onPointer(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.on = true;
  }
  // A finger only bites while it is down; a mouse until it leaves
  function onPointerEnd(e: PointerEvent) {
    if (e.type === "pointerleave" || e.pointerType !== "mouse") pointer.on = false;
  }

  const resizeObserver = new ResizeObserver(queueMeasure);
  resizeObserver.observe(stage);
  if (copyEl) resizeObserver.observe(copyEl);
  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
  });
  intersectionObserver.observe(stage);

  const passive = { passive: true };
  stage.addEventListener("pointerdown", onPointer, passive);
  stage.addEventListener("pointermove", onPointer, passive);
  stage.addEventListener("pointerup", onPointerEnd, passive);
  stage.addEventListener("pointercancel", onPointerEnd, passive);
  stage.addEventListener("pointerleave", onPointerEnd, passive);
  reduceMotion.addEventListener("change", play);

  measure();
  render();
  play();

  return () => {
    cancelAnimationFrame(raf);
    cancelAnimationFrame(pendingMeasure);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    stage.removeEventListener("pointerdown", onPointer);
    stage.removeEventListener("pointermove", onPointer);
    stage.removeEventListener("pointerup", onPointerEnd);
    stage.removeEventListener("pointercancel", onPointerEnd);
    stage.removeEventListener("pointerleave", onPointerEnd);
    reduceMotion.removeEventListener("change", play);
  };
}

export function HeroAscii() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    return startHeroAscii(canvasRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
