export type LayoutId = "single" | "strip-v" | "strip-h" | "grid" | "hero" | "polaroid";

export interface FrameDef {
  id: string;
  name: string;
  category: "Klasik" | "Lucu" | "Event";
  bg: string;
  accent: string;
  ink: string;
  pattern: "none" | "dots" | "stripes" | "stars" | "confetti";
  footer: string;
}

export const FRAMES: FrameDef[] = [
  { id: "putih", name: "Putih Bersih", category: "Klasik", bg: "#ffffff", accent: "#111827", ink: "#111827", pattern: "none", footer: "photobooth" },
  { id: "hitam", name: "Hitam Elegan", category: "Klasik", bg: "#111827", accent: "#f9fafb", ink: "#f9fafb", pattern: "none", footer: "photobooth" },
  { id: "krem", name: "Krem Retro", category: "Klasik", bg: "#f5ead9", accent: "#92400e", ink: "#78350f", pattern: "dots", footer: "good old days" },
  { id: "pink", name: "Pink Gemas", category: "Lucu", bg: "#ffd6e7", accent: "#ec4899", ink: "#9d174d", pattern: "stars", footer: "so cute!" },
  { id: "biru", name: "Biru Langit", category: "Lucu", bg: "#dbeafe", accent: "#2563eb", ink: "#1e3a8a", pattern: "dots", footer: "hello blue sky" },
  { id: "kuning", name: "Kuning Ceria", category: "Lucu", bg: "#fef08a", accent: "#f59e0b", ink: "#713f12", pattern: "confetti", footer: "shine bright" },
  { id: "mint", name: "Mint Segar", category: "Klasik", bg: "#ccfbf1", accent: "#0d9488", ink: "#134e4a", pattern: "stripes", footer: "fresh moment" },
  { id: "ultah", name: "Ulang Tahun", category: "Event", bg: "#ede9fe", accent: "#7c3aed", ink: "#4c1d95", pattern: "confetti", footer: "happy birthday!" },
  { id: "wisuda", name: "Wisuda", category: "Event", bg: "#1f2937", accent: "#fbbf24", ink: "#fde68a", pattern: "stars", footer: "we did it! class of 2026" },
  { id: "cinta", name: "Serba Cinta", category: "Event", bg: "#ffe4e6", accent: "#e11d48", ink: "#881337", pattern: "stars", footer: "with love" },
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
  { id: "single", name: "Single", desc: "1 foto besar", minPhotos: 1 },
  { id: "strip-v", name: "Strip Vertikal", desc: "Foto berderet ke bawah", minPhotos: 1 },
  { id: "strip-h", name: "Strip Horizontal", desc: "Foto berderet ke samping", minPhotos: 2 },
  { id: "grid", name: "Grid", desc: "Kolase kotak 2 kolom", minPhotos: 2 },
  { id: "hero", name: "Hero", desc: "1 foto utama + sisanya kecil", minPhotos: 2 },
  { id: "polaroid", name: "Polaroid", desc: "Bingkai putih ala instan", minPhotos: 1 },
];

export interface LayoutCell {
  x: number; y: number; w: number; h: number;
  card?: { x: number; y: number; w: number; h: number };
}

export function layoutGeometry(layout: LayoutId, count: number): { w: number; h: number; cells: LayoutCell[] } {
  const pad = 48, gap = 24, header = 72, footer = 110;
  const n = layout === "single" ? 1 : Math.max(1, count);
  const cells: LayoutCell[] = [];

  if (layout === "strip-h") {
    const cw = 450, ch = 562;
    for (let i = 0; i < n; i++) cells.push({ x: pad + i * (cw + gap), y: header, w: cw, h: ch });
    return { w: pad * 2 + cw * n + gap * (n - 1), h: header + ch + footer + pad, cells };
  }

  if (layout === "grid" && n >= 2) {
    const cw = 600, ch = 750;
    if (n === 3) {
      cells.push({ x: pad, y: header, w: cw, h: ch });
      cells.push({ x: pad + cw + gap, y: header, w: cw, h: ch });
      cells.push({ x: pad, y: header + ch + gap, w: cw * 2 + gap, h: ch });
      return { w: pad * 2 + cw * 2 + gap, h: header + ch * 2 + gap + footer + pad, cells };
    }
    const rows = Math.ceil(n / 2);
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / 2), c = i % 2;
      cells.push({ x: pad + c * (cw + gap), y: header + r * (ch + gap), w: cw, h: ch });
    }
    return { w: pad * 2 + cw * 2 + gap, h: header + ch * rows + gap * (rows - 1) + footer + pad, cells };
  }

  if (layout === "hero" && n >= 2) {
    const mainW = 600, mainH = 600;
    cells.push({ x: pad, y: header, w: mainW, h: mainH });
    const smallCount = n - 1;
    const sw = (mainW - gap * (smallCount - 1)) / smallCount;
    const sh = sw * 1.25;
    for (let i = 0; i < smallCount; i++) {
      cells.push({ x: pad + i * (sw + gap), y: header + mainH + gap, w: sw, h: sh });
    }
    return { w: pad * 2 + mainW, h: header + mainH + gap + sh + footer + pad, cells };
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
