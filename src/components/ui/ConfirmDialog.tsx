import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconAlertTriangle, IconHelpCircle } from '@tabler/icons-react'
import { useConfirmStore } from '../../store/useConfirmStore'
import { Button } from './Button'

export function ConfirmDialog() {
  const { open, options, handleConfirm, handleCancel } = useConfirmStore()
  const variant = options.variant ?? 'default'
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmBtnRef = useRef<HTMLButtonElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    // Simpan elemen yang tadi fokus, biar bisa dikembalikan pas tutup
    lastFocused.current = document.activeElement as HTMLElement
    // Auto-focus tombol konfirmasi (aksi utama)
    confirmBtnRef.current?.focus()

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, handleCancel])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Restore fokus ke elemen sebelumnya saat dialog ditutup
  useEffect(() => {
    if (open) return
    lastFocused.current?.focus?.()
  }, [open])

  // Focus trap — Tab / Shift+Tab berputar di dalam dialog
  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40"
            onClick={handleCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
            ref={dialogRef}
            onKeyDown={trapFocus}
            className="relative w-full max-w-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl z-10"
            style={{ borderWidth: '0.5px' }}
          >
            <div className="flex items-start gap-3 p-5">
              <div
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  variant === 'danger'
                    ? 'bg-red-50 dark:bg-red-950/30'
                    : 'bg-[var(--color-bg)]'
                }`}
              >
                {variant === 'danger' ? (
                  <IconAlertTriangle size={18} className="text-red-600" />
                ) : (
                  <IconHelpCircle size={18} className="text-[var(--color-text-secondary)]" />
                )}
              </div>
              <div className="min-w-0 pt-0.5">
                <h2
                  id="confirm-dialog-title"
                  className="text-sm font-semibold text-[var(--color-text-primary)]"
                >
                  {options.title}
                </h2>
                {options.description && (
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 leading-relaxed">
                    {options.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2 px-5 pb-5">
              <Button variant="ghost" onClick={handleCancel} className="flex-1">
                {options.cancelLabel ?? 'Batal'}
              </Button>
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onClick={handleConfirm}
                className="flex-1"
                ref={confirmBtnRef}
              >
                {options.confirmLabel ?? 'Ya, lanjutkan'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
