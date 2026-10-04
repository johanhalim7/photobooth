"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FILTERS, FRAMES, FrameDef, LayoutId, LAYOUTS, STICKERS } from "@/lib/data";
import { PlacedSticker, renderFinal } from "@/lib/render";
import { clearSessions, deleteSession, listSessions, saveSession, SessionRecord } from "@/lib/sessionDb";

type Stage = "landing" | "camera" | "editor" | "gallery";


export default function BoothApp() {
  const [stage, setStage] = useState<Stage>("landing");
  const [photos, setPhotos] = useState<string[]>([]);
  const [count, setCount] = useState(4);
  const [countdownSec, setCountdownSec] = useState(3);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [camError, setCamError] = useState("");
  const [displayCount, setDisplayCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [currentSlot, setCurrentSlot] = useState(0);
  const retakeRef = useRef<number | null>(null);

  const [layout, setLayout] = useState<LayoutId>("grid");
  const [frame, setFrame] = useState<FrameDef>(FRAMES[0]);
  const [filterId, setFilterId] = useState("original");
  const [adjust, setAdjust] = useState({ brightness: 0, contrast: 0, saturation: 0 });
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<number | null>(null);
  const [caption, setCaption] = useState("");
  const [watermark, setWatermark] = useState(true);
  const [preview, setPreview] = useState("");
  const [finalUrl, setFinalUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [tab, setTab] = useState<"Layout" | "Frame" | "Filter" | "Sticker" | "Teks">("Layout");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stickerId = useRef(1);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (stage !== "camera") {
      stopCamera();
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1600 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        if (!cancelled) {
          setCamError("Kamera tidak bisa dibuka. Pastikan izin kamera diizinkan di browser, atau pakai tombol Unggah Foto di bawah.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [stage, facing, stopCamera]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const waitCountdown = (sec: number) =>
    new Promise<void>((resolve) => {
      if (sec <= 0) return resolve();
      let left = sec;
      setDisplayCount(left);
      const iv = setInterval(() => {
        left -= 1;
        if (left <= 0) { clearInterval(iv); setDisplayCount(null); resolve(); }
        else setDisplayCount(left);
      }, 1000);
    });

  const snap = (): string | null => {
    const v = videoRef.current;
    if (!v || v.videoWidth === 0) return null;
    const W = 1200, H = 1500;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    if (!ctx) return null;
    const scale = Math.max(W / v.videoWidth, H / v.videoHeight);
    const dw = v.videoWidth * scale, dh = v.videoHeight * scale;
    if (facing === "user") { ctx.translate(W, 0); ctx.scale(-1, 1); }
    ctx.drawImage(v, (W - dw) / 2, (H - dh) / 2, dw, dh);
    return c.toDataURL("image/jpeg", 0.92);
  };

  const doCapture = async () => {
    if (capturing) return;
    setCapturing(true);
    const retake = retakeRef.current;
    const shots = retake !== null ? 1 : count;
    const results: string[] = [];
    for (let i = 0; i < shots; i++) {
      setCurrentSlot(retake !== null ? retake : i);
      await waitCountdown(countdownSec);
      setFlash(true);
      setTimeout(() => setFlash(false), 180);
      const shot = snap();
      if (shot) results.push(shot);
      if (i < shots - 1) await new Promise((r) => setTimeout(r, 400));
    }
    setCapturing(false);
    if (!results.length) { setMsg("Gagal mengambil foto, coba lagi ya."); return; }
    if (retake !== null) {
      setPhotos((prev) => prev.map((p, idx) => (idx === retake ? results[0] : p)));
      retakeRef.current = null;
    } else {
      setPhotos(results);
      if (results.length === 1) setLayout("single");
      else setLayout("grid");
    }
    setStage("editor");
  };

  const onUpload = (files: FileList | null) => {
    if (!files?.length) return;
    const readers = Array.from(files).slice(0, 4).map(
      (f) => new Promise<string>((res) => { const r = new FileReader(); r.onload = () => res(String(r.result)); r.readAsDataURL(f); })
    );
    Promise.all(readers).then((imgs) => {
      setPhotos(imgs);
      setLayout(imgs.length === 1 ? "single" : "grid");
      setStage("editor");
    });
  };

  const buildFinal = useCallback(async (withStickers: boolean, previewOnly = false) => {
    if (!photos.length) return "";
    return renderFinal({
      photos, layout, frame, filterId, adjust,
      stickers: withStickers ? stickers : [],
      caption, watermark, previewOnly,
    });
  }, [photos, layout, frame, filterId, adjust, stickers, caption, watermark]);

  useEffect(() => {
    if (stage !== "editor" || !photos.length) return;
    const t = setTimeout(() => { buildFinal(false, true).then(setPreview).catch(() => {}); }, 250);
    return () => clearTimeout(t);
  }, [stage, buildFinal, photos.length]);

  const prepareFinal = async () => {
    const url = await buildFinal(true);
    setFinalUrl(url);
    return url;
  };

  const doDownload = async () => {
    const url = finalUrl || (await prepareFinal());
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
    a.href = url;
    a.download = `photobooth-${stamp}.png`;
    a.click();
    setMsg("PNG terdownload. Cek folder unduhan kamu ya.");
  };

  const doShare = async () => {
    const url = finalUrl || (await prepareFinal());
    try {
      const blob = await (await fetch(url)).blob();
      const file = new File([blob], "photobooth.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Photobooth" });
        return;
      }
      if (navigator.share) { await navigator.share({ title: "Photobooth", text: "Hasil photobooth-ku!" }); return; }
      throw new Error("no-share");
    } catch {
      setMsg("Browser ini tidak mendukung share langsung — file didownload saja ya.");
      doDownload();
    }
  };

  const doSaveSession = async () => {
    const url = finalUrl || (await prepareFinal());
    await saveSession({ id: `${Date.now()}`, createdAt: Date.now(), image: url, layout });
    setMsg("Tersimpan di Sesi Saya (lokal di perangkat ini).");
  };

  const openGallery = async () => {
    setSessions(await listSessions());
    setStage("gallery");
  };

  const dragSticker = (e: React.PointerEvent, id: number) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    const parent = target.parentElement;
    if (!parent) return;
    const move = (ev: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = Math.min(0.97, Math.max(0.03, (ev.clientX - rect.left) / rect.width));
      const y = Math.min(0.97, Math.max(0.03, (ev.clientY - rect.top) / rect.height));
      setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
      setFinalUrl("");
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-zinc-950 text-zinc-50">
      <header className="flex items-center justify-between px-5 py-4">
        <button onClick={() => setStage("landing")} className="text-left">
          <p className="text-lg font-black tracking-tight">✦ PHOTOBOOTH</p>
          <p className="text-[11px] text-zinc-400">Buka link, foto, jadi.</p>
        </button>
        <button onClick={openGallery} className="rounded-full bg-zinc-800 px-3 py-2 text-xs font-semibold">Sesi Saya</button>
      </header>

      {msg && <div className="mx-5 mb-3 rounded-xl bg-emerald-500/15 px-3 py-2 text-xs text-emerald-300">{msg}</div>}

      {stage === "landing" && (
        <section className="flex flex-1 flex-col px-5 pb-8">
          <h1 className="mt-4 text-4xl font-black leading-tight">Photobooth di browser kamu.</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Selfie pakai kamera HP/laptop, pilih frame & filter, lalu download PNG-nya. Tanpa install, tanpa akun.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="rounded-2xl bg-zinc-900 p-3">📸<br />Countdown & retake</div>
            <div className="rounded-2xl bg-zinc-900 p-3">🎞️<br />Strip / grid estetik</div>
            <div className="rounded-2xl bg-zinc-900 p-3">🔒<br />Foto tidak di-upload</div>
          </div>
          <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-amber-400 to-sky-500 p-4">
            <div className="rounded-2xl bg-white p-2">
              <div className="grid grid-cols-2 gap-1 text-center text-4xl">
                <span className="rounded bg-pink-100 py-5">🥳</span>
                <span className="rounded bg-sky-100 py-5">😎</span>
                <span className="rounded bg-amber-100 py-5">🤍</span>
                <span className="rounded bg-emerald-100 py-5">📸</span>
              </div>
              <p className="py-2 text-center text-xs font-bold text-zinc-800">✦ PHOTOBOOTH ✦</p>
            </div>
          </div>
          <button onClick={() => setStage("camera")} className="mt-auto rounded-full bg-white py-4 text-base font-black text-zinc-950">
            Mulai Foto
          </button>
          <p className="mt-3 text-center text-[11px] text-zinc-500">Foto diproses di perangkatmu dan tidak dikirim ke server.</p>
        </section>
      )}

      {stage === "camera" && (
        <section className="flex flex-1 flex-col px-5 pb-6">
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900" style={{ aspectRatio: "4/5" }}>
            <video ref={videoRef} playsInline muted className="h-full w-full object-cover" style={{ transform: facing === "user" ? "scaleX(-1)" : undefined }} />
            {flash && <div className="absolute inset-0 bg-white" />}
            {displayCount !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-8xl font-black">{displayCount}</div>
            )}
            <p className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[11px]">
              {capturing ? `Foto ${currentSlot + 1}…` : "Siap-siap ya"}
            </p>
          </div>
          {camError && <p className="mt-3 rounded-xl bg-red-500/15 px-3 py-2 text-xs text-red-300">{camError}</p>}

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <label className="rounded-2xl bg-zinc-900 p-3">
              Jumlah foto
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="mt-2 w-full rounded-lg bg-zinc-800 px-2 py-2">
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} foto</option>)}
              </select>
            </label>
            <label className="rounded-2xl bg-zinc-900 p-3">
              Countdown
              <select value={countdownSec} onChange={(e) => setCountdownSec(Number(e.target.value))} className="mt-2 w-full rounded-lg bg-zinc-800 px-2 py-2">
                {[0, 3, 5, 10].map((n) => <option key={n} value={n}>{n} detik</option>)}
              </select>
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button onClick={() => fileRef.current?.click()} className="rounded-full bg-zinc-800 px-4 py-3 text-xs font-semibold">Unggah Foto</button>
            <button onClick={doCapture} disabled={capturing} className="h-16 w-16 rounded-full border-4 border-white bg-red-500 disabled:opacity-50" aria-label="Ambil foto" />
            <button onClick={() => setFacing(facing === "user" ? "environment" : "user")} className="rounded-full bg-zinc-800 px-4 py-3 text-xs font-semibold">Ganti Kamera</button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onUpload(e.target.files)} />
        </section>
      )}

      {stage === "editor" && (
        <section className="flex flex-1 flex-col px-5 pb-6">
          <div className="relative mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl bg-white">
            {preview ? <img src={preview} alt="Hasil photobooth" className="w-full" /> : <div className="flex h-64 items-center justify-center text-zinc-500">Menyiapkan preview…</div>}
            <div className="absolute inset-0">
              {stickers.map((s) => (
                <button key={s.id} onPointerDown={(e) => { setSelectedSticker(s.id); dragSticker(e, s.id); }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 select-none ${selectedSticker === s.id ? "rounded-full ring-2 ring-sky-400" : ""}`}
                  style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%`, fontSize: s.size * 0.55 }}>
                  {s.emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto">
            {photos.map((p, i) => (
              <button key={i} onClick={() => { retakeRef.current = i; setStage("camera"); }} className="relative shrink-0">
                <img src={p} alt={`Foto ${i + 1}`} className="h-16 w-14 rounded-lg object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[10px]">Retake</span>
              </button>
            ))}
            <button onClick={() => { retakeRef.current = null; setStage("camera"); }} className="flex h-16 w-14 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[10px]">Ulang Semua</button>
          </div>

          <div className="mt-4 flex gap-1 rounded-full bg-zinc-900 p-1 text-[11px] font-semibold">
            {(["Layout", "Frame", "Filter", "Sticker", "Teks"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-full py-2 ${tab === t ? "bg-white text-zinc-950" : "text-zinc-300"}`}>{t}</button>
            ))}
          </div>

          <div className="mt-3 min-h-28 rounded-2xl bg-zinc-900 p-3">
            {tab === "Layout" && (
              <div>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUTS.map((l) => (
                    <button key={l.id} disabled={photos.length < l.minPhotos} onClick={() => { setLayout(l.id); setFinalUrl(""); }}
                      className={`rounded-xl px-3 py-3 text-left disabled:opacity-40 ${layout === l.id ? "bg-white text-zinc-950" : "bg-zinc-800"}`}>
                      <span className="block text-xs font-bold">{l.name}</span>
                      <span className={`block text-[10px] ${layout === l.id ? "text-zinc-600" : "text-zinc-400"}`}>{l.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-zinc-500">Single memakai foto pertama. Layout lain memakai semua foto sesi ini.</p>
              </div>
            )}
            {tab === "Frame" && (
              <div className="grid grid-cols-5 gap-2">
                {FRAMES.map((f) => (
                  <button key={f.id} onClick={() => { setFrame(f); setFinalUrl(""); }} className={`rounded-xl p-2 text-[10px] ${frame.id === f.id ? "ring-2 ring-white" : ""}`} style={{ background: f.bg, color: f.ink }}>
                    🎞️<br />{f.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            )}
            {tab === "Filter" && (
              <div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {FILTERS.map((f) => (
                    <button key={f.id} onClick={() => { setFilterId(f.id); setFinalUrl(""); }} className={`shrink-0 rounded-full px-3 py-2 text-[11px] ${filterId === f.id ? "bg-white text-zinc-950" : "bg-zinc-800"}`}>{f.name}</button>
                  ))}
                </div>
                {(["brightness", "contrast", "saturation"] as const).map((k) => (
                  <label key={k} className="mt-2 block text-[11px] capitalize text-zinc-400">
                    {k === "brightness" ? "Kecerahan" : k === "contrast" ? "Kontras" : "Saturasi"} {adjust[k]}
                    <input type="range" min={-50} max={50} value={adjust[k]} onChange={(e) => { setAdjust({ ...adjust, [k]: Number(e.target.value) }); setFinalUrl(""); }} className="w-full" />
                  </label>
                ))}
              </div>
            )}
            {tab === "Sticker" && (
              <div>
                <div className="grid grid-cols-8 gap-1 text-xl">
                  {STICKERS.map((e) => (
                    <button key={e} onClick={() => { const s = { id: stickerId.current++, emoji: e, x: 0.5, y: 0.45, size: 54 }; setStickers((p) => [...p, s]); setSelectedSticker(s.id); setFinalUrl(""); }}>{e}</button>
                  ))}
                </div>
                {selectedSticker !== null && (
                  <div className="mt-3 flex items-center gap-2 text-[11px]">
                    <span>Ukuran</span>
                    <input type="range" min={28} max={110} value={stickers.find((s) => s.id === selectedSticker)?.size ?? 54}
                      onChange={(e) => { setStickers((p) => p.map((s) => (s.id === selectedSticker ? { ...s, size: Number(e.target.value) } : s))); setFinalUrl(""); }} className="flex-1" />
                    <button onClick={() => { setStickers((p) => p.filter((s) => s.id !== selectedSticker)); setSelectedSticker(null); setFinalUrl(""); }} className="rounded bg-red-500/20 px-2 py-1 text-red-300">Hapus</button>
                  </div>
                )}
                <p className="mt-2 text-[10px] text-zinc-500">Geser sticker langsung di preview.</p>
              </div>
            )}
            {tab === "Teks" && (
              <div>
                <input value={caption} onChange={(e) => { setCaption(e.target.value); setFinalUrl(""); }} maxLength={42} placeholder="Tulis caption di footer…" className="w-full rounded-xl bg-zinc-800 px-3 py-3 text-sm outline-none" />
                <label className="mt-3 flex items-center justify-between text-xs">
                  Watermark kecil
                  <input type="checkbox" checked={watermark} onChange={(e) => { setWatermark(e.target.checked); setFinalUrl(""); }} className="h-5 w-5" />
                </label>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={doDownload} className="rounded-full bg-white py-3 text-xs font-black text-zinc-950">Download PNG</button>
            <button onClick={doShare} className="rounded-full bg-zinc-800 py-3 text-xs font-bold">Share</button>
            <button onClick={doSaveSession} className="rounded-full bg-zinc-800 py-3 text-xs font-bold">Simpan Sesi</button>
          </div>
        </section>
      )}

      {stage === "gallery" && (
        <section className="flex flex-1 flex-col px-5 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black">Sesi Saya</h2>
            {sessions.length > 0 && <button onClick={async () => { await clearSessions(); setSessions([]); }} className="text-xs text-red-300">Hapus Semua</button>}
          </div>
          {!sessions.length && <p className="mt-8 text-center text-sm text-zinc-500">Belum ada sesi tersimpan di perangkat ini.</p>}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {sessions.map((s) => (
              <div key={s.id} className="overflow-hidden rounded-2xl bg-zinc-900">
                <img src={s.image} alt="Sesi tersimpan" className="w-full" />
                <div className="flex gap-1 p-2">
                  <a href={s.image} download={`photobooth-${s.id}.png`} className="flex-1 rounded bg-white px-2 py-1 text-center text-[11px] font-bold text-zinc-950">Unduh</a>
                  <button onClick={async () => { await deleteSession(s.id); setSessions(await listSessions()); }} className="rounded bg-zinc-800 px-2 py-1 text-[11px]">Hapus</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStage(photos.length ? "editor" : "landing")} className="mt-6 rounded-full bg-zinc-800 py-3 text-sm font-bold">Kembali</button>
        </section>
      )}
    </main>
  );
}
