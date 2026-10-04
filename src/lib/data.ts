export type LayoutId =
  | "single" | "strip-v" | "strip-h" | "grid" | "grid3" | "grid4"
  | "hero" | "poster" | "mosaic" | "brick" | "duo" | "circles"
  | "stairs" | "magazine" | "film" | "polaroid";

export type PatternKind =
  | "none" | "dots" | "stripes" | "stars" | "confetti"
  | "hearts" | "music" | "flowers" | "bolts" | "waves";

export interface FrameDef {
  id: string;
  name: string;
  category: "Klasik" | "Lucu" | "Event" | "Gradasi" | "Elegan";
  bg: string;
  gradient?: [string, string];
  accent: string;
  ink: string;
  pattern: PatternKind;
  footer: string;
}

export const FRAMES: FrameDef[] = [
  { id: "putih", name: "Putih Bersih", category: "Klasik", bg: "#ffffff", accent: "#111827", ink: "#111827", pattern: "none", footer: "photobooth" },
  { id: "hitam", name: "Hitam Elegan", category: "Klasik", bg: "#111827", accent: "#f9fafb", ink: "#f9fafb", pattern: "none", footer: "photobooth" },
  { id: "krem", name: "Krem Retro", category: "Klasik", bg: "#f5ead9", accent: "#92400e", ink: "#78350f", pattern: "dots", footer: "good old days" },
  { id: "kertas", name: "Kertas Retro", category: "Klasik", bg: "#fefce8", accent: "#a16207", ink: "#713f12", pattern: "waves", footer: "est. today" },
  { id: "matcha", name: "Matcha", category: "Klasik", bg: "#d9f99d", accent: "#65a30d", ink: "#365314", pattern: "flowers", footer: "calm & fresh" },
  { id: "kopi", name: "Kopi Susu", category: "Klasik", bg: "#e7ddd3", accent: "#6f1d1b", ink: "#431407", pattern: "dots", footer: "coffee first" },
  { id: "pink", name: "Pink Gemas", category: "Lucu", bg: "#ffd6e7", accent: "#ec4899", ink: "#9d174d", pattern: "stars", footer: "so cute!" },
  { id: "biru", name: "Biru Langit", category: "Lucu", bg: "#dbeafe", accent: "#2563eb", ink: "#1e3a8a", pattern: "dots", footer: "hello blue sky" },
  { id: "kuning", name: "Kuning Ceria", category: "Lucu", bg: "#fef08a", accent: "#f59e0b", ink: "#713f12", pattern: "confetti", footer: "shine bright" },
  { id: "neon", name: "Neon Night", category: "Lucu", bg: "#020617", accent: "#22d3ee", ink: "#e0f2fe", pattern: "bolts", footer: "after dark" },
  { id: "mint", name: "Mint Segar", category: "Lucu", bg: "#ccfbf1", accent: "#0d9488", ink: "#134e4a", pattern: "stripes", footer: "fresh moment" },
  { id: "ultah", name: "Ulang Tahun", category: "Event", bg: "#ede9fe", accent: "#7c3aed", ink: "#4c1d95", pattern: "confetti", footer: "happy birthday!" },
  { id: "wisuda", name: "Wisuda", category: "Event", bg: "#1f2937", accent: "#fbbf24", ink: "#fde68a", pattern: "stars", footer: "we did it! class of 2026" },
  { id: "cinta", name: "Serba Cinta", category: "Event", bg: "#ffe4e6", accent: "#e11d48", ink: "#881337", pattern: "hearts", footer: "with love" },
  { id: "sakura", name: "Sakura", category: "Event", bg: "#fff1f2", accent: "#fb7185", ink: "#881337", pattern: "flowers", footer: "spring day" },
  { id: "musik", name: "Musik", category: "Event", bg: "#fef3c7", accent: "#d97706", ink: "#78350f", pattern: "music", footer: "play it loud" },
  { id: "sunset", name: "Sunset", category: "Gradasi", bg: "#ff9a56", gradient: ["#ff9a56", "#ff6a95"], accent: "#fff7ed", ink: "#7c2d12", pattern: "hearts", footer: "golden hour" },
  { id: "ocean", name: "Ocean", category: "Gradasi", bg: "#38bdf8", gradient: ["#38bdf8", "#0d9488"], accent: "#ecfeff", ink: "#083344", pattern: "waves", footer: "sea breeze" },
  { id: "grape", name: "Grape Soda", category: "Gradasi", bg: "#a78bfa", gradient: ["#a78bfa", "#ec4899"], accent: "#fdf4ff", ink: "#581c87", pattern: "stars", footer: "pop fizz" },
  { id: "pelangi", name: "Pelangi Pastel", category: "Gradasi", bg: "#fda4af", gradient: ["#fda4af", "#fde68a"], accent: "#1f2937", ink: "#111827", pattern: "confetti", footer: "colorful day" },
  { id: "luxury", name: "Emas Hitam", category: "Elegan", bg: "#18181b", accent: "#d4af37", ink: "#fde68a", pattern: "stars", footer: "timeless" },
  { id: "marun", name: "Merah Marun", category: "Elegan", bg: "#7f1d1d", accent: "#fecaca", ink: "#fee2e2", pattern: "none", footer: "classic" },
  { id: "botol", name: "Hijau Botol", category: "Elegan", bg: "#14532d", accent: "#bbf7d0", ink: "#dcfce7", pattern: "stripes", footer: "evergreen" },
  { id: "dongker", name: "Biru Dongker", category: "Elegan", bg: "#172554", accent: "#fbbf24", ink: "#dbeafe", pattern: "stars", footer: "midnight" },
];

export interface FilterDef { id: string; name: string; css: string }
export const FILTERS: FilterDef[] = [
  { id: "original", name: "Original", css: "" },
  { id: "warm", name: "Warm", css: "sepia(0.35) saturate(1.3) hue-rotate(-10deg)" },
  { id: "cool", name: "Cool", css: "saturate(1.1) hue-rotate(15deg) brightness(1.05)" },
  { id: "bw", name: "B/W", css: "grayscale(1) contrast(1.1)" },
  { id: "vintage", name: "Vintage", css: "sepia(0.6) contrast(0.9) brightness(1.05) saturate(0.8)" },
  { id: "soft", name: "Soft", css: "brightness(1.12) contrast(0.88) saturate(0.9)" },
  { id: "vivid", name: "Vivid", css: "saturate(1.6) contrast(1.12)" },
  { id: "pastel", name: "Pastel", css: "brightness(1.1) saturate(0.75) contrast(0.92)" },
];

export const STICKERS: string[] = [
  "❤️","⭐","✨","🌸","🦋","🎀","🔥","😎","🥳","🎉","🎂","🎓",
  "💐","🌈","☁️","🍓","🧸","👑","💖","📸","🌙","☀️","🍕","🚀",
  "🐱","🐶","🎵","💯","👍","🫶","😂","🤍","🖤","💛",
];

export interface LayoutOption {
  id: LayoutId;
  name: string;
  desc: string;
  minPhotos: number;
}

export const LAYOUTS: LayoutOption[] = [
  { id: "grid", name: "Grid Kolase", desc: "Kolase kotak 2 kolom (default)", minPhotos: 2 },
  { id: "single", name: "Single", desc: "1 foto besar", minPhotos: 1 },
  { id: "strip-v", name: "Strip Vertikal", desc: "Foto berderet ke bawah", minPhotos: 1 },
  { id: "strip-h", name: "Strip Horizontal", desc: "Foto berderet ke samping", minPhotos: 2 },
  { id: "hero", name: "Hero", desc: "1 foto utama + sisanya kecil", minPhotos: 2 },
  { id: "poster", name: "Hero Samping", desc: "Foto utama kiri + tumpukan kanan", minPhotos: 2 },
  { id: "mosaic", name: "Mozaik", desc: "Pola bata besar-kecil berselang", minPhotos: 3 },
  { id: "brick", name: "Susun Bata", desc: "Baris bergeser ala dinding bata", minPhotos: 3 },
  { id: "grid3", name: "Grid 3 Kolom", desc: "Kolase rapat 3 kolom", minPhotos: 3 },
  { id: "grid4", name: "Grid 4 Kolom", desc: "Kolase padat 4 kolom, cocok foto banyak", minPhotos: 4 },
  { id: "duo", name: "Duo", desc: "2 foto tinggi berdampingan", minPhotos: 2 },
  { id: "circles", name: "Bulat", desc: "Foto lingkaran ala avatar", minPhotos: 1 },
  { id: "stairs", name: "Tangga", desc: "Foto menurun bertangga miring", minPhotos: 2 },
  { id: "magazine", name: "Majalah", desc: "Sampul besar + strip kecil", minPhotos: 1 },
  { id: "film", name: "Film Strip", desc: "Strip ala roll film klasik", minPhotos: 1 },
  { id: "polaroid", name: "Polaroid", desc: "Bingkai putih ala instan", minPhotos: 1 },
];

export interface LayoutCell {
  x: number; y: number; w: number; h: number;
  card?: { x: number; y: number; w: number; h: number };
  circle?: boolean;
}

const PAD = 48, GAP = 24, HEADER = 72, FOOTER = 110;

function gridCells(cols: number, cw: number, ch: number, n: number, spanLast = false): { w: number; h: number; cells: LayoutCell[] } {
  const cells: LayoutCell[] = [];
  const rows = Math.ceil(n / cols);
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols), c = i % cols;
    const isLast = i === n - 1;
    const wCell = spanLast && isLast && n % cols === 1 ? cw * cols + GAP * (cols - 1) : cw;
    cells.push({ x: PAD + c * (cw + GAP), y: HEADER + r * (ch + GAP), w: wCell, h: ch });
  }
  return { w: PAD * 2 + cw * cols + GAP * (cols - 1), h: HEADER + ch * rows + GAP * (rows - 1) + FOOTER + PAD, cells };
}

export function layoutGeometry(layout: LayoutId, count: number): { w: number; h: number; cells: LayoutCell[]; film?: boolean } {
  const pad = PAD, gap = GAP, header = HEADER, footer = FOOTER;
  const n = layout === "single" ? 1 : Math.max(1, count);
  const cells: LayoutCell[] = [];

  if (layout === "strip-h") {
    const cw = 450, ch = 562;
    for (let i = 0; i < n; i++) cells.push({ x: pad + i * (cw + gap), y: header, w: cw, h: ch });
    return { w: pad * 2 + cw * n + gap * (n - 1), h: header + ch + footer + pad, cells };
  }

  if (layout === "grid") {
    if (n === 1) {
      cells.push({ x: pad, y: header, w: 600, h: 750 });
      return { w: pad * 2 + 600, h: header + 750 + footer + pad, cells };
    }
    return gridCells(2, 600, 750, n, true);
  }

  if (layout === "grid3") return gridCells(3, 392, 490, n);
  if (layout === "grid4") return gridCells(4, 300, 375, n);

  if (layout === "hero" && n >= 2) {
    const mainW = 600, mainH = 600;
    cells.push({ x: pad, y: header, w: mainW, h: mainH });
    const smallTotal = n - 1;
    const perRow = 3;
    const sw = (mainW - gap * (perRow - 1)) / perRow;
    const sh = sw * 1.25;
    const rows = Math.ceil(smallTotal / perRow);
    for (let i = 0; i < smallTotal; i++) {
      const r = Math.floor(i / perRow), c = i % perRow;
      cells.push({ x: pad + c * (sw + gap), y: header + mainH + gap + r * (sh + gap), w: sw, h: sh });
    }
    return { w: pad * 2 + mainW, h: header + mainH + gap + sh * rows + gap * (rows - 1) + footer + pad, cells };
  }

  if (layout === "poster" && n >= 2) {
    const mainW = 600, mainH = 1000, sw = 400;
    cells.push({ x: pad, y: header, w: mainW, h: mainH });
    const smallTotal = n - 1;
    const sh = (mainH - gap * (smallTotal - 1)) / smallTotal;
    for (let i = 0; i < smallTotal; i++) {
      cells.push({ x: pad + mainW + gap, y: header + i * (sh + gap), w: sw, h: sh });
    }
    return { w: pad * 2 + mainW + gap + sw, h: header + mainH + footer + pad, cells };
  }

  if (layout === "mosaic" && n >= 3) {
    const bigW = 800, smallW = 400, ch = 500, totalW = bigW + gap + smallW;
    let idx = 0, row = 0;
    while (idx < n) {
      const remain = n - idx;
      const y = header + row * (ch + gap);
      if (remain === 1) {
        cells.push({ x: pad, y, w: totalW, h: ch });
        idx += 1;
      } else {
        if (row % 2 === 0) {
          cells.push({ x: pad, y, w: bigW, h: ch });
          cells.push({ x: pad + bigW + gap, y, w: smallW, h: ch });
        } else {
          cells.push({ x: pad, y, w: smallW, h: ch });
          cells.push({ x: pad + smallW + gap, y, w: bigW, h: ch });
        }
        idx += 2;
      }
      row += 1;
    }
    return { w: pad * 2 + totalW, h: header + ch * row + gap * (row - 1) + footer + pad, cells };
  }

  if (layout === "brick" && n >= 3) {
    const cw = 600, ch = 500;
    const rows = Math.ceil(n / 2);
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / 2), c = i % 2;
      const offset = r % 2 === 1 ? 200 : 0;
      cells.push({ x: pad + offset + c * (cw + gap), y: header + r * (ch + gap), w: cw, h: ch });
    }
    return { w: pad * 2 + 200 + cw * 2 + gap, h: header + ch * rows + gap * (rows - 1) + footer + pad, cells };
  }

  if (layout === "duo") {
    const m = Math.min(n, 2);
    const cw = 500, ch = 800;
    for (let i = 0; i < m; i++) cells.push({ x: pad + i * (cw + gap), y: header, w: cw, h: ch });
    return { w: pad * 2 + cw * m + gap * (m - 1), h: header + ch + footer + pad, cells };
  }

  if (layout === "circles") {
    if (n === 1) {
      cells.push({ x: pad, y: header, w: 560, h: 560, circle: true });
      return { w: pad * 2 + 560, h: header + 560 + footer + pad, cells };
    }
    const cs = n > 4 ? 400 : 560;
    const cols = n > 4 ? 3 : 2;
    const g = gridCells(cols, cs, cs, n);
    g.cells.forEach((c) => (c.circle = true));
    return g;
  }

  if (layout === "stairs" && n >= 2) {
    const cw = 500, ch = 625, dx = 150, dy = 130;
    for (let i = 0; i < n; i++) cells.push({ x: pad + i * dx, y: header + i * dy, w: cw, h: ch });
    return { w: pad * 2 + cw + dx * (n - 1), h: header + ch + dy * (n - 1) + footer + pad, cells };
  }

  if (layout === "magazine") {
    const mainW = 900, mainH = 1050;
    cells.push({ x: pad, y: header, w: mainW, h: mainH });
    if (n > 1) {
      const smallTotal = n - 1;
      const perRow = 3;
      const sw = (mainW - gap * (perRow - 1)) / perRow;
      const sh = sw * 1.25;
      const rows = Math.ceil(smallTotal / perRow);
      for (let i = 0; i < smallTotal; i++) {
        const r = Math.floor(i / perRow), c = i % perRow;
        cells.push({ x: pad + c * (sw + gap), y: header + mainH + gap + r * (sh + gap), w: sw, h: sh });
      }
      return { w: pad * 2 + mainW, h: header + mainH + gap + sh * rows + gap * (rows - 1) + footer + pad, cells };
    }
    return { w: pad * 2 + mainW, h: header + mainH + footer + pad, cells };
  }

  if (layout === "film") {
    const cw = 520, ch = 650, bar = 60;
    for (let i = 0; i < n; i++) cells.push({ x: pad + bar, y: header + i * (ch + gap), w: cw, h: ch });
    return { w: pad * 2 + bar * 2 + cw, h: header + ch * n + gap * (n - 1) + footer + pad, cells, film: true };
  }

  if (layout === "polaroid") {
    const cardW = 600, cardH = 760, photoW = 552, photoH = 620;
    for (let i = 0; i < n; i++) {
      const cardY = header + i * (cardH + gap);
      cells.push({
        x: pad + 24, y: cardY + 24, w: photoW, h: photoH,
        card: { x: pad, y: cardY, w: cardW, h: cardH },
      });
    }
    return { w: pad * 2 + cardW, h: header + cardH * n + gap * (n - 1) + footer + pad, cells };
  }

  // single & strip-v
  const cw = 600, ch = 750;
  for (let i = 0; i < n; i++) cells.push({ x: pad, y: header + i * (ch + gap), w: cw, h: ch });
  return { w: pad * 2 + cw, h: header + ch * n + gap * (n - 1) + footer + pad, cells };
}

export const MAX_PHOTOS = 8;
