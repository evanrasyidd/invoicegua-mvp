import { useRegisterSW } from 'virtual:pwa-register/react'
import { IconRefresh, IconX } from '@tabler/icons-react'

// Tanpa komponen ini, service worker nyimpen cache lama selamanya —
// user gak akan pernah lihat fitur/fix baru walaupun sudah di-deploy ulang,
// karena registerType: 'prompt' butuh trigger manual buat update.
export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Cek update tiap 60 detik selama app dibuka — supaya user gak nunggu reload manual
      if (!registration) return
      setInterval(() => {
        registration.update()
      }, 60_000)
    },
  })

  if (!needRefresh) return null

  const handleUpdate = () => {
    updateServiceWorker(true)
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[var(--color-primary)] text-[var(--color-surface)] text-xs font-medium px-4 py-3 rounded-[10px] shadow-lg max-w-[calc(100vw-2rem)]">
      <IconRefresh size={15} className="shrink-0" />
      <span className="whitespace-nowrap">Versi baru tersedia</span>
      <button
        onClick={handleUpdate}
        className="bg-[var(--color-surface)] text-[var(--color-primary)] text-[11px] font-semibold px-3 py-1 rounded-[6px] cursor-pointer hover:opacity-90 transition-opacity shrink-0"
      >
        Update
      </button>
      <button
        onClick={() => setNeedRefresh(false)}
        className="text-[var(--color-surface)]/60 hover:text-[var(--color-surface)] cursor-pointer shrink-0"
        aria-label="Tutup"
      >
        <IconX size={14} />
      </button>
    </div>
  )
}
