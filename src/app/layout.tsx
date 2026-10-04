import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photobooth — Buka Link, Foto, Jadi",
  description:
    "Photobooth online di browser: selfie pakai kamera HP/laptop, pilih frame, filter, dan sticker, lalu download PNG. Tanpa install, tanpa akun, foto tidak di-upload.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body className="bg-zinc-950 antialiased">{children}</body>
    </html>
  );
}
