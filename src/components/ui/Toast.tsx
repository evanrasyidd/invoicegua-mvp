import { AnimatePresence, motion } from 'framer-motion'
import { IconCheck, IconX, IconInfoCircle } from '@tabler/icons-react'
import { useAppStore } from '../../store/useAppStore'

export function Toast() {
  const { toast, clearToast } = useAppStore()

  const icons = {
    success: <IconCheck size={15} />,
    error: <IconX size={15} />,
    info: <IconInfoCircle size={15} />,
  }

  const colors = {
    success: 'bg-[#0F0F0F] text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-[#0F0F0F] text-white',
  }

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-sm font-medium shadow-lg ${colors[toast.type]}`}
        >
          {icons[toast.type]}
          <span>{toast.message}</span>
          <button onClick={clearToast} className="ml-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
            <IconX size={13} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
