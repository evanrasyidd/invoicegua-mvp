import { pdf } from '@react-pdf/renderer'
import type { ReactElement } from 'react'

/**
 * Generate dan download PDF dari @react-pdf/renderer Document element.
 * Tidak ada dependency html2canvas / jspdf — pure JS, zero known vulns.
 *
 * @param element  - React element yang return dari <PDFTemplate />
 * @param filename - nama file hasil download, contoh "INV-2025-001.pdf"
 */
export async function exportToPDF(element: ReactElement, filename: string): Promise<void> {
  const instance = pdf(element)
  const blob = await instance.toBlob()
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // Revoke setelah delay supaya download sempat mulai
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
