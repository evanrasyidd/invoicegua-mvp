import { pdf } from '@react-pdf/renderer'
import type { ReactElement } from 'react'

/**
 * Generate dan download PDF dari @react-pdf/renderer Document element.
 * Menggunakan formatIDRPdf dan formatDatePdf (bukan Intl API) supaya
 * angka dan tanggal render dengan benar di dalam PDF engine.
 */
export async function exportToPDF(element: ReactElement, filename: string): Promise<void> {
  // Timeout 30 detik — antisipasi font CDN lambat
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout: font gagal dimuat. Coba lagi atau periksa koneksi.')), 30_000),
  )

  const generate = async () => {
    const instance = pdf(element)
    const blob = await instance.toBlob()

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  await Promise.race([generate(), timeout])
}
