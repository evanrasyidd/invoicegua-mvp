import { useState } from 'react'
import { IconLogout, IconKey, IconCheck } from '@tabler/icons-react'
import { useAuthStore } from '../../store/useAuthStore'
import { changePassword } from '../../lib/auth'
import { useAppStore } from '../../store/useAppStore'
import { confirmDialog } from '../../store/useConfirmStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'

// Section akun untuk halaman Setelan — akses utama ganti password & keluar di mobile,
// karena UserMenu di sidebar cuma muncul di desktop (md:flex).
export function AccountSection() {
  const { user, logout } = useAuthStore()
  const { showToast } = useAppStore()
  const [oldPw, setOldPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  if (!user) return null

  const initials = user.displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleChangePassword = async () => {
    if (!oldPw || !newPw) return
    setPwLoading(true)
    try {
      await changePassword(user.username, oldPw, newPw)
      showToast('Password berhasil diubah', 'success')
      setOldPw('')
      setNewPw('')
      setPwSaved(true)
      setTimeout(() => setPwSaved(false), 2000)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Gagal ubah password', 'error')
    } finally {
      setPwLoading(false)
    }
  }

  const handleLogout = async () => {
    const ok = await confirmDialog({
      title: 'Keluar dari akun?',
      description: 'Kamu perlu login lagi untuk mengakses data invoice dan klien.',
      confirmLabel: 'Keluar',
    })
    if (!ok) return
    logout()
    window.location.href = '/login'
  }

  const inputCls =
    'bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] w-full focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]'

  return (
    <section>
      <h2 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">Akun</h2>
      <Card>
        <div className="space-y-4">
          {/* Identitas */}
          <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-border-light)]">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-[var(--color-surface)]">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                {user.displayName}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">@{user.username}</p>
            </div>
          </div>

          {/* Ganti password */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1.5">
              <IconKey size={13} />
              Ganti Password
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="password"
                placeholder="Password lama"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                autoComplete="current-password"
                className={inputCls}
                style={{ borderWidth: '0.5px' }}
              />
              <input
                type="password"
                placeholder="Password baru (min. 6)"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
                className={inputCls}
                style={{ borderWidth: '0.5px' }}
              />
            </div>
            <Button
              onClick={handleChangePassword}
              loading={pwLoading}
              disabled={!oldPw || !newPw}
              size="sm"
            >
              {pwSaved ? (
                <span className="flex items-center gap-1.5"><IconCheck size={13} /> Tersimpan</span>
              ) : (
                'Simpan Password Baru'
              )}
            </Button>
          </div>

          {/* Logout */}
          <div className="pt-2 border-t border-[var(--color-border-light)]">
            <Button variant="danger" onClick={handleLogout} className="w-full">
              <IconLogout size={14} />
              Keluar dari Akun
            </Button>
          </div>
        </div>
      </Card>
    </section>
  )
}
