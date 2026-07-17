import { useState, useRef, useEffect, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft, IconUpload, IconCheck } from '@tabler/icons-react'
import {
  useBusinessProfile,
  useBankInfo,
  saveBusinessProfile,
  saveBankInfo,
  saveLogoBase64,
  useLogoBase64,
  useSetting,
  saveSetting,
  type BusinessProfile,
  type BankInfo,
} from '../hooks/useBusinessProfile'
import { useAppStore } from '../store/useAppStore'
import { ServiceTemplateList } from '../components/service/ServiceTemplateList'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function SettingsBusiness() {
  const navigate = useNavigate()
  const { showToast } = useAppStore()
  const business = useBusinessProfile()
  const bank = useBankInfo()
  const logo = useLogoBase64()
  const defaultDueDays = useSetting('defaultDueDays')
  const defaultTaxRate = useSetting('defaultTaxRate')
  const defaultPaymentTerms = useSetting('defaultPaymentTerms')

  const [bizForm, setBizForm] = useState<BusinessProfile>({
    name: '', ownerName: '', email: '', phone: '', address: '', city: '',
  })
  const [bankForm, setBankForm] = useState<BankInfo>({
    bankName: '', accountNumber: '', accountHolder: '',
  })
  const [dueDays, setDueDays] = useState('3')
  const [taxRate, setTaxRate] = useState('0')
  const [paymentTerms, setPaymentTerms] = useState('')
  const [bizLoading, setBizLoading] = useState(false)
  const [bankLoading, setBankLoading] = useState(false)
  const [bizSaved, setBizSaved] = useState(false)
  const [bankSaved, setBankSaved] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (business) setBizForm(business) }, [business])
  useEffect(() => { if (bank) setBankForm(bank) }, [bank])
  useEffect(() => { if (defaultDueDays != null) setDueDays(defaultDueDays) }, [defaultDueDays])
  useEffect(() => { if (defaultTaxRate != null) setTaxRate(defaultTaxRate) }, [defaultTaxRate])
  useEffect(() => { if (defaultPaymentTerms != null) setPaymentTerms(defaultPaymentTerms) }, [defaultPaymentTerms])

  const handleSaveBiz = async () => {
    if (!bizForm.name.trim()) { showToast('Nama bisnis wajib diisi', 'error'); return }
    setBizLoading(true)
    try {
      await saveBusinessProfile(bizForm)
      await saveSetting('defaultDueDays', dueDays)
      await saveSetting('defaultTaxRate', taxRate)
      await saveSetting('defaultPaymentTerms', paymentTerms)
      setBizSaved(true)
      showToast('Profil bisnis disimpan', 'success')
      setTimeout(() => setBizSaved(false), 2000)
    } catch { showToast('Gagal menyimpan', 'error') }
    finally { setBizLoading(false) }
  }

  const handleSaveBank = async () => {
    setBankLoading(true)
    try {
      await saveBankInfo(bankForm)
      setBankSaved(true)
      showToast('Info bank disimpan', 'success')
      setTimeout(() => setBankSaved(false), 2000)
    } catch { showToast('Gagal menyimpan', 'error') }
    finally { setBankLoading(false) }
  }

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) { showToast('Ukuran logo max 1MB', 'error'); return }
    const reader = new FileReader()
    reader.onload = async (ev) => {
      await saveLogoBase64(ev.target?.result as string)
      showToast('Logo disimpan', 'success')
    }
    reader.readAsDataURL(file)
  }

  const inputCls =
    'bg-[var(--color-bg)] border border-[var(--color-border)] text-sm rounded-[8px] px-[10px] py-[7px] w-full focus:outline-none focus:border-[var(--color-primary)] transition-colors text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]'

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    placeholder?: string,
    type = 'text',
  ) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-[var(--color-text-secondary)]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
        style={{ borderWidth: '0.5px' }}
      />
    </div>
  )

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/settings')} className="shrink-0">
          <IconArrowLeft size={15} />
        </Button>
        <div>
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">Bisnis</h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Profil, rekening, dan template layanan
          </p>
        </div>
      </div>

      {/* Business profile */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">Profil Bisnis</h2>
        <Card>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-[8px] border border-[var(--color-border)] bg-[var(--color-bg)] flex items-center justify-center overflow-hidden cursor-pointer hover:border-[var(--color-primary)] transition-colors shrink-0"
                style={{ borderWidth: '0.5px' }}
                onClick={() => logoInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && logoInputRef.current?.click()}
                aria-label="Upload logo"
              >
                {logo ? (
                  <img src={logo} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <IconUpload size={18} className="text-[var(--color-text-muted)]" />
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-[var(--color-text-primary)]">Logo bisnis</p>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">PNG/JPG, max 1MB</p>
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="text-[10px] text-[var(--color-text-primary)] underline mt-1 cursor-pointer"
                >
                  Ganti logo
                </button>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            <div className="grid gap-3">
              {field('Nama Bisnis *', bizForm.name, (v) => setBizForm((f) => ({ ...f, name: v })), 'EgaxDev Studios')}
              {field('Nama Pemilik', bizForm.ownerName, (v) => setBizForm((f) => ({ ...f, ownerName: v })), 'Evan Rasyid')}
              {field('Email', bizForm.email, (v) => setBizForm((f) => ({ ...f, email: v })), 'hello@egaxdev.com', 'email')}
              {field('No. HP / WA', bizForm.phone, (v) => setBizForm((f) => ({ ...f, phone: v })), '08123456789')}
              {field('Alamat', bizForm.address, (v) => setBizForm((f) => ({ ...f, address: v })), 'Jl. Contoh No. 1')}
              {field('Kota', bizForm.city, (v) => setBizForm((f) => ({ ...f, city: v })), 'Depok, Jawa Barat')}
            </div>

            <div className="pt-3 border-t border-[var(--color-border-light)]">
              <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-3">Default Invoice</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)]">Jatuh tempo (hari)</label>
                  <input type="number" min="1" max="365" value={dueDays} onChange={(e) => setDueDays(e.target.value)} className={inputCls} style={{ borderWidth: '0.5px' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[var(--color-text-secondary)]">PPN default (%)</label>
                  <input type="number" min="0" max="100" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} className={inputCls} style={{ borderWidth: '0.5px' }} />
                </div>
              </div>
              <div className="flex flex-col gap-1 mt-3">
                <label className="text-xs font-medium text-[var(--color-text-secondary)]">Syarat pembayaran default</label>
                <input type="text" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} placeholder="Transfer dalam 3 hari kerja..." className={inputCls} style={{ borderWidth: '0.5px' }} />
              </div>
            </div>

            <Button onClick={handleSaveBiz} loading={bizLoading} className="w-full">
              {bizSaved ? <span className="flex items-center gap-1.5"><IconCheck size={14} /> Tersimpan</span> : 'Simpan Profil Bisnis'}
            </Button>
          </div>
        </Card>
      </section>

      {/* Bank info */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">Info Rekening</h2>
        <Card>
          <div className="space-y-3">
            {field('Nama Bank', bankForm.bankName, (v) => setBankForm((f) => ({ ...f, bankName: v })), 'BCA / Mandiri / BRI...')}
            {field('Nomor Rekening', bankForm.accountNumber, (v) => setBankForm((f) => ({ ...f, accountNumber: v })), '1234567890')}
            {field('Nama Pemilik Rekening', bankForm.accountHolder, (v) => setBankForm((f) => ({ ...f, accountHolder: v })), 'Evan Rasyid Ega Pratama')}
            <Button onClick={handleSaveBank} loading={bankLoading} className="w-full">
              {bankSaved ? <span className="flex items-center gap-1.5"><IconCheck size={14} /> Tersimpan</span> : 'Simpan Info Rekening'}
            </Button>
          </div>
        </Card>
      </section>

      {/* Service templates */}
      <section>
        <h2 className="text-sm font-semibold mb-3 text-[var(--color-text-primary)]">Template Layanan</h2>
        <ServiceTemplateList />
      </section>
    </div>
  )
}
