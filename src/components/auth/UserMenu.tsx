import { useState, useRef, useEffect } from 'react'
import { IconLogout, IconKey, IconChevronUp } from '@tabler/icons-react'
import { useAuthStore } from '../../store/useAuthStore'
import { changePassword } from '../../lib/auth'
import { useAppStore } from '../../store/useAppStore'

export function UserMenu() {
  const { user, logout } = useAuthStore()
  const { showToast } = useAppStore()
  const [open, setOpen] = useState(false)
  const [changePwMode, setChangePwMode] = useState(false)
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setChangePwMode(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  const initials = user.displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleChangePw = async () => {
    if (!oldPw || !newPw) return
    setPwLoading(true)
    try {
      await changePassword(user.username, oldPw, newPw)
      showToast('Password berhasil diubah', 'success')
      setChangePwMode(false)
      setOldPw('')
      setNewPw('')
      setOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal ubah password', 'error')
    } finally {
      setPwLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div ref={ref} className="relative px-2 pb-2">
      <button
        onClick={() => { setOpen(!open); setChangePwMode(false) }}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[6px] transition-colors cursor-pointer hover:bg-white/10"
        aria-label="Menu akun"
        aria-expanded={open}
      >
        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <span className="text-[9px] font-semibold text-white">{initials}</span>
        </div>
        <span className="text-xs text-white/60 truncate flex-1 text-left">{user.displayName}</span>
        <IconChevronUp
          size={12}
          className={`text-white/40 transition-transform duration-150 ${open ? '' : 'rotate-180'}`}
        />
      </button>

      {open && (
        <div
          className="absolute bottom-full left-2 right-2 mb-1 bg-white border border-[#E5E7EB] rounded-[8px] shadow-lg z-50 overflow-hidden"
          style={{ borderWidth: '0.5px' }}
        >
          <div className="px-3 py-2.5 border-b border-[#F3F4F6]">
            <p className="text-xs font-medium text-[#0F0F0F]">{user.displayName}</p>
            <p className="text-[10px] text-[#9CA3AF]">@{user.username}</p>
          </div>

          {changePwMode ? (
            <div className="p-3 space-y-2">
              <p className="text-[10px] font-medium text-[#6B7280] mb-2">Ganti Password</p>
              <input
                type="password"
                placeholder="Password lama"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                autoComplete="current-password"
                className="w-full text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] px-2.5 py-1.5 focus:outline-none focus:border-[#0F0F0F] text-[#0F0F0F] placeholder:text-[#9CA3AF]"
                style={{ borderWidth: '0.5px' }}
              />
              <input
                type="password"
                placeholder="Password baru (min. 6)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
                className="w-full text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-[6px] px-2.5 py-1.5 focus:outline-none focus:border-[#0F0F0F] text-[#0F0F0F] placeholder:text-[#9CA3AF]"
                style={{ borderWidth: '0.5px' }}
              />
              <div className="flex gap-1.5 pt-1">
                <button
                  onClick={handleChangePw}
                  disabled={pwLoading || !oldPw || !newPw}
                  className="flex-1 text-[10px] font-medium bg-[#0F0F0F] text-white py-1.5 rounded-[6px] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {pwLoading ? '...' : 'Simpan'}
                </button>
                <button
                  onClick={() => { setChangePwMode(false); setOldPw(''); setNewPw('') }}
                  className="flex-1 text-[10px] font-medium border border-[#E5E7EB] text-[#6B7280] py-1.5 rounded-[6px] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                  style={{ borderWidth: '0.5px' }}
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setChangePwMode(true)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-[#374151] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
              >
                <IconKey size={13} className="text-[#9CA3AF]" />
                Ganti Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 transition-colors cursor-pointer border-t border-[#F3F4F6]"
              >
                <IconLogout size={13} />
                Keluar
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
