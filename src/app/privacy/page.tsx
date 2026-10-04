export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-10 text-zinc-900">
      <h1 className="text-3xl font-black">Kebijakan Privasi</h1>
      <div className="mt-5 space-y-4 text-sm leading-relaxed">
        <p>Photobooth Web memproses foto sepenuhnya di perangkat kamu melalui browser. Foto tidak di-upload ke server kami pada alur utama aplikasi.</p>
        <p>Hasil yang kamu simpan melalui tombol Simpan Sesi tersimpan lokal di browser perangkatmu (IndexedDB). Kamu bisa menghapusnya kapan saja dari halaman Sesi Saya atau dengan menghapus data situs di browser.</p>
        <p>Izin kamera hanya diminta setelah kamu menekan tombol mulai. Kamera berhenti saat kamu meninggalkan halaman studio.</p>
        <p>Jika kamu memilih membagikan hasil melalui fitur Share, file dikirim oleh sistem operasi/browser ke aplikasi tujuan pilihanmu, di luar kendali kami.</p>
      </div>
    </main>
  );
}
