import { useState, useRef, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconDownload, IconUpload, IconAlertTriangle } from '@tabler/icons-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useAppStore } from '../store/useAppStore'
import { confirmDialog } from '../store/useConfirmStore'
import { exportBackup, importBackup, factoryReset } from '../hooks/useExport'

export function SettingsData() {
  const navigate = useNavigate()
  const { showToast } = useAppStore()
  const [importLoading, setImportLoading] = useState(false)
  const importInputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportLoading(true)
    try {
      await importBackup(file)
      showToast('Data berhasil diimpor, halaman akan di-refresh...', 'success')
      setTimeout(() => window.location.reload(), 1500)
    } catch { showToast('File backup tidak valid', 'error') }
    finally {
      setImportLoading(false)
      if (importInputRef.current) importInputRef.current.value = ''
    }
  }

  const handleFactoryReset = async () => {
    const step1 = await confirmDialog({
      title: 'Reset semua data?',
      description: 'SEMUA invoice, klien, dan pengaturan akan dihapus permanen. Akun login tidak akan terhapus.',
      variant: 'danger',
      confirmLabel: 'Lanjutkan',
    })
    if (!step1) return

    const step2 = await confirmDialog({
      title: 'Yakin mau reset?',
      description: 'Ini tindakan terakhir — data tidak bisa dikembalikan setelah ini.',
      variant: 'danger',
      confirmLabel: 'Ya, Reset Sekarang',
    })
    if (!step2) return

    await factoryReset()
    showToast('Data direset ke awal', 'info')
    setTimeout(() => window.location.reload(), 1000)
  }

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="shrink-0">
          <IconArrowLeft size={15} />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Data</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Backup, restore, dan hapus data
          </p>
        </div>
      </div>

      {/* Backup & restore */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">Backup & Restore</h2>
        <Card>
          <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              Semua data tersimpan di browser kamu (IndexedDB). Backup rutin disarankan agar data tidak hilang saat ganti device atau clear cache.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={exportBackup} className="flex-1">
                <IconDownload size={14} />
                Ekspor Backup
              </Button>
              <Button variant="ghost" onClick={() => importInputRef.current?.click()} loading={importLoading} className="flex-1">
                <IconUpload size={14} />
                Impor Backup
              </Button>
              <input ref={importInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleImport} />
            </div>
          </div>
        </Card>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-sm font-semibold mb-3 text-red-500 flex items-center gap-1.5">
          <IconAlertTriangle size={14} />
          Zona Bahaya
        </h2>
        <Card>
          <div className="space-y-3">
            <p className="text-xs text-[var(--color-text-muted)]">
              Reset semua data ke kondisi awal. Invoice, klien, dan pengaturan akan dihapus permanen. Akun login tidak akan terhapus.
            </p>
            <Button variant="danger" onClick={handleFactoryReset} className="w-full">
              Reset Semua Data
            </Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
