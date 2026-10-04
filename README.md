# Photobooth Web (Next.js)

Photobooth online untuk umum: selfie dari kamera HP/laptop, pilih layout strip/grid,
frame, filter, dan sticker, lalu download PNG atau share — tanpa install, tanpa akun.
Seluruh pemrosesan foto dilakukan **client-side** di browser (Canvas); tidak ada foto
yang di-upload ke server. Hasil sesi tersimpan lokal di IndexedDB.

## Fitur MVP

- Kamera depan/belakang (`getUserMedia`), countdown 0/3/5/10 detik, flash, retake per slot
- Fallback unggah foto dari galeri perangkat
- Layout: Single, Strip Vertikal, Strip Horizontal, Grid fleksibel, Hero (1 besar + kecil), Polaroid
- 10 frame, 8 filter + slider kecerahan/kontras/saturasi
- 34 sticker (drag & resize di preview), caption footer, watermark opsional
- Download PNG resolusi 2x, Web Share API (fallback download)
- Galeri "Sesi Saya" lokal (IndexedDB): unduh ulang, hapus satu, hapus semua
- Halaman kebijakan privasi `/privacy`

## Menjalankan

```bash
npm install
npm run dev    # pengembangan
npm run build  # production build
npm run start  # production server
```

Kamera browser membutuhkan HTTPS (atau `localhost`) di perangkat nyata.

## Deploy ke Vercel

Import repo ini di Vercel (framework preset: Next.js), tanpa environment variable
wajib untuk MVP. Semua halaman statis/client-side.

## Struktur

- `src/app/` — route `/` (studio) dan `/privacy`
- `src/components/BoothApp.tsx` — alur landing → kamera → editor → galeri
- `src/lib/data.ts` — katalog frame, filter, sticker, ukuran layout
- `src/lib/render.ts` — komposisi Canvas foto → filter → frame → sticker → watermark
- `src/lib/sessionDb.ts` — penyimpanan sesi lokal (IndexedDB)

Sesuai PRD `prd-web-photobooth-nextjs` (konsep opsi 1, Next.js App Router).
