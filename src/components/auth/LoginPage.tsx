import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { IconEye, IconEyeOff, IconArrowRight, IconAlertCircle } from '@tabler/icons-react'
import { login, register, hasAnyUser } from '../../lib/auth'
import { useAuthStore } from '../../store/useAuthStore'
import { SpecimenInvoicePanel } from './SpecimenInvoicePanel'

type Mode = 'login' | 'register'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()
  const from = (location.state as { from?: string })?.from ?? '/'

  const [mode, setMode] = useState<Mode>('login')
  const [firstRun, setFirstRun] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  // Kalau belum ada user sama sekali, paksa ke register
  useEffect(() => {
    hasAnyUser().then((has) => {
      if (!has) {
        setMode('register')
        setFirstRun(true)
      }
    })
  }, [])

  const resetForm = () => {
    setError('')
    setUsername('')
    setDisplayName('')
    setPassword('')
    setConfirm('')
  }

  const switchMode = (next: Mode) => {
    resetForm()
    setMode(next)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (mode === 'register' && password !== confirm) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    setLoading(true)
    try {
      let user
      if (mode === 'login') {
        user = await login({ username, password })
      } else {
        user = await register({ username, displayName, password })
      }
      setUser(user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full bg-[#F9FAFB] border border-[#E5E7EB] text-sm rounded-[8px] px-[10px] py-[9px] focus:outline-none focus:border-[#0F0F0F] transition-colors text-[#0F0F0F] placeholder:text-[#9CA3AF]'

  const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true'

  return (
    <div className="min-h-screen bg-[#F9FAFB] lg:grid lg:grid-cols-2">
      {/* Panel kiri — contoh invoice, desktop only */}
      <SpecimenInvoicePanel />

      {/* Form */}
      <div className="flex items-center justify-center p-4 min-h-screen lg:min-h-0">
        <div className="w-full max-w-[360px]">
          {/* Wordmark — mobile only, desktop sudah ada di panel kiri */}
          <div className="text-center mb-8 lg:hidden">
            <span className="font-mono text-xl font-semibold text-[#0F0F0F] tracking-tight">
              InvoiceGua
            </span>
            <p className="text-xs text-[#6B7280] mt-1.5">
              Invoice & penawaran profesional, tanpa ribet
            </p>
          </div>

          {firstRun && mode === 'register' && (
            <p className="hidden lg:block text-xs text-[#6B7280] text-center mb-6">
              Buat akun pertama kamu untuk mulai
            </p>
          )}

          <div
            className="bg-white border rounded-xl overflow-hidden"
            style={{ borderColor: '#E5E7EB', borderWidth: '0.5px' }}
          >
            {/* Tab switcher — sembunyikan kalau first run */}
            {!firstRun && (
              <div className="flex border-b" style={{ borderColor: '#E5E7EB', borderWidth: '0.5px' }}>
                {(['login', 'register'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`flex-1 py-3 text-xs font-medium transition-colors cursor-pointer ${
                      mode === m
                        ? 'text-[#0F0F0F] border-b-2 border-[#0F0F0F] -mb-px'
                        : 'text-[#9CA3AF] hover:text-[#6B7280]'
                    }`}
                  >
                    {m === 'login' ? 'Masuk' : 'Daftar'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-5 space-y-3" noValidate>
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {/* Username */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#6B7280]">Username</label>
                    <input
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      value={username}
                      onChange={(e) => { setUsername(e.target.value); setError('') }}
                      placeholder="contoh: evanrasyidd"
                      required
                      className={inputCls}
                      style={{ borderWidth: '0.5px' }}
                    />
                  </div>

                  {/* Display name — hanya register */}
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-1"
                    >
                      <label className="text-xs font-medium text-[#6B7280]">Nama Tampilan</label>
                      <input
                        type="text"
                        autoComplete="name"
                        value={displayName}
                        onChange={(e) => { setDisplayName(e.target.value); setError('') }}
                        placeholder="Evan Rasyid"
                        required
                        className={inputCls}
                        style={{ borderWidth: '0.5px' }}
                      />
                    </motion.div>
                  )}

                  {/* Password */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-[#6B7280]">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setError('') }}
                        placeholder={mode === 'register' ? 'Min. 6 karakter' : '••••••'}
                        required
                        className={`${inputCls} pr-10`}
                        style={{ borderWidth: '0.5px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      >
                        {showPassword ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password — hanya register */}
                  {mode === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col gap-1"
                    >
                      <label className="text-xs font-medium text-[#6B7280]">Konfirmasi Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={confirm}
                          onChange={(e) => { setConfirm(e.target.value); setError('') }}
                          placeholder="Ulangi password"
                          required
                          className={`${inputCls} ${confirm && confirm !== password ? 'border-red-400' : ''}`}
                          style={{ borderWidth: '0.5px' }}
                        />
                        {confirm && confirm !== password && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400">
                            <IconAlertCircle size={14} />
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-[6px] px-3 py-2"
                    style={{ borderWidth: '0.5px' }}
                  >
                    <IconAlertCircle size={13} className="shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#0F0F0F] text-white text-sm font-medium py-2.5 rounded-[8px] hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-1"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' ? 'Masuk' : firstRun ? 'Buat Akun & Mulai' : 'Daftar'}
                    <IconArrowRight size={14} />
                  </>
                )}
              </button>

              {/* Demo mode notice */}
              {isDemoMode && mode === 'register' && !firstRun && (
                <p className="text-[10px] text-[#9CA3AF] text-center">
                  Registrasi dinonaktifkan di mode demo
                </p>
              )}
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-[#9CA3AF] mt-6">
            InvoiceGua — by{' '}
            <a
              href="https://github.com/evanrasyidd"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#6B7280] transition-colors"
            >
              evanrasyidd
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
