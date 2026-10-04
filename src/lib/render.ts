import { FrameDef, LayoutId, layoutGeometry } from "./data";

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
    ctx.strokeStyle = frame.accent;
    for (let x = -h; x < w; x += 36) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h, h); ctx.stroke();
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

function clamp(v: number) { return v < 0 ? 0 : v > 255 ? 255 : v; }

/**
 * Terapkan filter preset + penyesuaian per-piksel.
 * Sengaja TIDAK memakai ctx.filter karena tidak didukung semua browser
 * (terutama Safari iOS) sehingga filter terlihat tidak berubah.
 */
function applyPixelFilter(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  filterId: string,
  adjust: Adjust
) {
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const bF = 1 + adjust.brightness / 100;
  const cF = 1 + adjust.contrast / 100;
  const sF = 1 + adjust.saturation / 100;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i + 1], b = d[i + 2];

    switch (filterId) {
      case "bw": {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = g = b = gray;
        break;
      }
      case "vintage": {
        const nr = 0.393 * r + 0.769 * g + 0.189 * b;
        const ng = 0.349 * r + 0.686 * g + 0.168 * b;
        const nb = 0.272 * r + 0.534 * g + 0.131 * b;
        r = nr * 0.95 + 12; g = ng * 0.95 + 6; b = nb * 0.9;
        break;
      }
      case "warm":
        r *= 1.14; g *= 1.03; b *= 0.82;
        break;
      case "cool":
        r *= 0.88; g *= 1.0; b *= 1.16;
        break;
      case "soft":
        r = r * 0.9 + 24; g = g * 0.9 + 24; b = b * 0.9 + 24;
        break;
      case "vivid": {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = gray + (r - gray) * 1.55;
        g = gray + (g - gray) * 1.55;
        b = gray + (b - gray) * 1.55;
        break;
      }
      case "pastel": {
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        r = (gray + (r - gray) * 0.7) * 1.06 + 10;
        g = (gray + (g - gray) * 0.7) * 1.06 + 10;
        b = (gray + (b - gray) * 0.7) * 1.06 + 10;
        break;
      }
      default:
        break;
    }

    r *= bF; g *= bF; b *= bF;
    r = (r - 128) * cF + 128;
    g = (g - 128) * cF + 128;
    b = (b - 128) * cF + 128;
    if (sF !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * sF;
      g = gray + (g - gray) * sF;
      b = gray + (b - gray) * sF;
    }

    d[i] = clamp(r); d[i + 1] = clamp(g); d[i + 2] = clamp(b);
  }
  ctx.putImageData(imageData, 0, 0);
}

function photoCanvas(img: HTMLImageElement, w: number, h: number, filterId: string, adjust: Adjust): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  if (filterId !== "original" || adjust.brightness !== 0 || adjust.contrast !== 0 || adjust.saturation !== 0) {
    applyPixelFilter(ctx, w, h, filterId, adjust);
  }
  return c;
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
  previewOnly?: boolean;
}): Promise<string> {
  const usePhotos = opts.layout === "single" ? opts.photos.slice(0, 1) : opts.photos;
  const size = layoutGeometry(opts.layout, usePhotos.length);
  const canvas = document.createElement("canvas");
  canvas.width = size.w;
  canvas.height = size.h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");

  ctx.fillStyle = opts.frame.bg;
  ctx.fillRect(0, 0, size.w, size.h);
  drawPattern(ctx, opts.frame, size.w, size.h);

  const imgs = await Promise.all(usePhotos.map(loadImage));

  if (size.film) {
    ctx.save();
    ctx.fillStyle = "#111111";
    const barX1 = 48 - 20, barX2 = size.w - 48 + 20 - 60;
    ctx.fillRect(barX1, 72 - 12, 60, size.h - 72 - 110 + 24);
    ctx.fillRect(barX2, 72 - 12, 60, size.h - 72 - 110 + 24);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    for (let y = 84; y < size.h - 130; y += 92) {
      ctx.fillRect(barX1 + 12, y, 36, 54);
      ctx.fillRect(barX2 + 12, y, 36, 54);
    }
    ctx.restore();
  }

  size.cells.forEach((p, i) => {
    if (p.card) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.3)"; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(p.card.x, p.card.y, p.card.w, p.card.h);
      ctx.restore();
    }
    const cell = photoCanvas(imgs[i], p.w, p.h, opts.filterId, opts.adjust);
    if (!p.card && !p.circle) {
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.25)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
      ctx.fillStyle = "#fff"; ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.restore();
    }
    if (p.circle) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(cell, p.x, p.y);
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = opts.frame.accent;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h / 2, p.w / 2 - 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.drawImage(cell, p.x, p.y);
      ctx.save();
      ctx.strokeStyle = opts.frame.accent;
      ctx.lineWidth = 10;
      ctx.strokeRect(p.x + 5, p.y + 5, p.w - 10, p.h - 10);
      ctx.restore();
    }
  });

  ctx.fillStyle = opts.frame.ink;
  ctx.font = "700 30px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✦ PHOTOBOOTH ✦", size.w / 2, 46);

  for (const s of opts.stickers) {
    ctx.font = `${s.size}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(s.emoji, s.x * size.w, s.y * size.h);
  }

  const footerY = size.h - 52;
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

  if (opts.previewOnly) return canvas.toDataURL("image/png");

  const out = document.createElement("canvas");
  out.width = canvas.width * 2; out.height = canvas.height * 2;
  const octx = out.getContext("2d");
  if (!octx) return canvas.toDataURL("image/png");
  octx.imageSmoothingQuality = "high";
  octx.drawImage(canvas, 0, 0, out.width, out.height);
  return out.toDataURL("image/png");
}
