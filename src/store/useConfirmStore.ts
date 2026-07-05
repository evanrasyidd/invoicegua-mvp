import { create } from 'zustand'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'default'
}

interface ConfirmStore {
  open: boolean
  options: ConfirmOptions
  resolve: ((value: boolean) => void) | null
  request: (options: ConfirmOptions) => Promise<boolean>
  handleConfirm: () => void
  handleCancel: () => void
}

const EMPTY_OPTIONS: ConfirmOptions = { title: '' }

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  open: false,
  options: EMPTY_OPTIONS,
  resolve: null,

  request: (options) =>
    new Promise<boolean>((resolve) => {
      set({ open: true, options, resolve })
    }),

  handleConfirm: () => {
    get().resolve?.(true)
    set({ open: false, resolve: null })
  },

  handleCancel: () => {
    get().resolve?.(false)
    set({ open: false, resolve: null })
  },
}))

/**
 * Pengganti native confirm() browser — return Promise<boolean>, harus di-await.
 *
 * Sebelum: if (!confirm('Hapus?')) return
 * Sekarang: if (!(await confirmDialog({ title: 'Hapus?', variant: 'danger' }))) return
 *
 * Bisa dipanggil dari mana aja (handler async), gak perlu jadi komponen React,
 * karena Zustand store punya getState() yang bisa diakses di luar render tree.
 */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().request(options)
}
