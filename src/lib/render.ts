import { FILTERS, FrameDef, LayoutId, layoutSize } from "./data";

export interface PlacedSticker { id: number; emoji: string; x: number; y: number; size: number }
export interface Adjust { brightness: number; contrast: number; saturation: number }

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawPattern(ctx: CanvasRenderingContext2D, frame: FrameDef, w: number, h: number) {
  ctx.save();
  ctx.fillStyle = frame.accent;
  ctx.globalAlpha = 0.16;
  if (frame.pattern === "dots") {
    for (let x = 18; x < w; x += 44) for (let y = 14; y < h; y += 44) {
      ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
    }
  } else if (frame.pattern === "stripes") {
    ctx.lineWidth = 7;
    for (let x = -h; x < w; x += 36) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.strokeStyle = frame.accent; ctx.stroke();
    }
  } else if (frame.pattern === "stars" || frame.pattern === "confetti") {
    const glyph = frame.pattern === "stars" ? "★" : "•";
    ctx.font = "26px sans-serif";
    let seed = 7;
    const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 70; i++) ctx.fillText(glyph, rand() * w, rand() * h);
  }
  ctx.restore();
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  ctx.save();
  ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.restore();
}

export async function renderFinal(opts: {
  photos: string[];
  layout: LayoutId;
  frame: FrameDef;
  filterId: string;
  adjust: Adjust;
  stickers: PlacedSticker[];
  caption: string;
  watermark: boolean;
}): Promise<string> {
  const count = opts.photos.length;
  const size = layoutSize(opts.layout, count);
  const SCALE = 2;
  const canvas = document.createElement("canvas");
  canvas.width = size.w * SCALE / 2; // base 600px cell -> final strip ~ (size.w) px wide at 1x of layout units/ ?
  canvas.width = size.w; // layout units already px at export scale below
  canvas.height = size.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");

  // background + pattern hanya di area non-foto (digambar penuh lalu foto menimpa tengah)
  ctx.fillStyle = opts.frame.bg;
  ctx.fillRect(0, 0, size.w, size.h);
  drawPattern(ctx, opts.frame, size.w, size.h);

  const preset = FILTERS.find((f) => f.id === opts.filterId)?.css ?? "";
  const adj = `brightness(${1 + opts.adjust.brightness / 100}) contrast(${1 + opts.adjust.contrast / 100}) saturate(${1 + opts.adjust.saturation / 100})`;
  ctx.filter = `${preset} ${adj}`.trim() || "none";

  const imgs = await Promise.all(opts.photos.map(loadImage));
  const positions: { x: number; y: number }[] = [];
  if (opts.layout === "grid" && count === 4) {
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
      positions.push({ x: size.pad + c * (size.cellW + size.gap), y: size.header + r * (size.cellH + size.gap) });
    }
  } else {
    for (let i = 0; i < count; i++) {
      positions.push({ x: size.pad, y: size.header + i * (size.cellH + size.gap) });
    }
  }
  positions.forEach((p, i) => {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
    ctx.fillStyle = "#fff"; ctx.fillRect(p.x, p.y, size.cellW, size.cellH);
    ctx.restore();
    drawCover(ctx, imgs[i], p.x, p.y, size.cellW, size.cellH);
  });
  ctx.filter = "none";

  // header brand
  ctx.fillStyle = opts.frame.ink;
  ctx.font = "700 30px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✦ PHOTOBOOTH ✦", size.w / 2, 46);

  // stickers (posisi ternormalisasi terhadap kanvas final)
  for (const s of opts.stickers) {
    ctx.font = `${s.size}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(s.emoji, s.x * size.w, s.y * size.h);
  }

  // footer: caption + watermark
  const footerY = size.h - size.footer + 58;
  ctx.fillStyle = opts.frame.ink;
  if (opts.caption.trim()) {
    ctx.font = "600 34px system-ui, sans-serif";
    ctx.fillText(opts.caption.trim().slice(0, 42), size.w / 2, footerY);
  } else {
    ctx.font = "italic 30px system-ui, sans-serif";
    ctx.globalAlpha = 0.85;
    ctx.fillText(opts.frame.footer, size.w / 2, footerY);
    ctx.globalAlpha = 1;
  }
  if (opts.watermark) {
    ctx.font = "500 20px system-ui, sans-serif";
    ctx.globalAlpha = 0.65;
    ctx.fillText("dibuat dengan Photobooth Web", size.w / 2, size.h - 26);
    ctx.globalAlpha = 1;
  }

  // upscale 2x untuk ketajaman unduhan
  const out = document.createElement("canvas");
  out.width = canvas.width * 2; out.height = canvas.height * 2;
  const octx = out.getContext("2d");
  if (!octx) return canvas.toDataURL("image/png");
  octx.imageSmoothingQuality = "high";
  octx.drawImage(canvas, 0, 0, out.width, out.height);
  return out.toDataURL("image/png");
}
