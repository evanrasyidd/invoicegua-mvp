import { type ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconX } from '@tabler/icons-react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40 flex items-end md:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_event, info) => { if (info.offset.y > 80) onClose() }}
            className="relative w-full bg-[var(--color-surface)] rounded-t-2xl z-50 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-1 bg-[var(--color-border)] rounded-full" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border-light)]">
                <span className="text-sm font-semibold">{title}</span>
                <button onClick={onClose} className="text-[var(--color-text-muted)] cursor-pointer">
                  <IconX size={16} />
                </button>
              </div>
            )}
            <div className="p-5 pb-safe">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
