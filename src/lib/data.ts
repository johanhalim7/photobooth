export type LayoutId = "single" | "strip" | "grid";

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

export function layoutSize(layout: LayoutId, count: number) {
  const cellW = 600, cellH = 750, pad = 48, gap = 24, header = 72, footer = 110;
  if (layout === "grid" && count === 4) {
    const w = pad * 2 + cellW * 2 + gap;
    const h = header + footer + cellH * 2 + gap + pad;
    return { w, h, cellW, cellH, pad, gap, header, footer, cols: 2 };
  }
  if (layout === "single" || count === 1) {
    return { w: pad * 2 + cellW, h: header + footer + cellH + pad, cellW, cellH, pad, gap, header, footer, cols: 1 };
  }
  return { w: pad * 2 + cellW, h: header + footer + cellH * count + gap * (count - 1) + pad, cellW, cellH, pad, gap, header, footer, cols: 1 };
}
