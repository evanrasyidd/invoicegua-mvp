import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'

export interface BusinessProfile {
  name: string
  ownerName: string
  email: string
  phone: string
  address: string
  city: string
}

export interface BankInfo {
  bankName: string
  accountNumber: string
  accountHolder: string
}

export function useBusinessProfile() {
  return useLiveQuery(async () => {
    const setting = await db.settings.get('businessProfile')
    if (!setting) return null
    return JSON.parse(setting.value) as BusinessProfile
  })
}

export function useBankInfo() {
  return useLiveQuery(async () => {
    const setting = await db.settings.get('bankInfo')
    if (!setting) return null
    return JSON.parse(setting.value) as BankInfo
  })
}

export function useLogoBase64() {
  return useLiveQuery(async () => {
    const setting = await db.settings.get('logoBase64')
    return setting?.value ?? null
  })
}

export function useSetting(key: string) {
  return useLiveQuery(async () => {
    const setting = await db.settings.get(key)
    return setting?.value ?? null
  }, [key])
}

export async function saveBusinessProfile(profile: BusinessProfile): Promise<void> {
  await db.settings.put({ key: 'businessProfile', value: JSON.stringify(profile) })
}

export async function saveBankInfo(info: BankInfo): Promise<void> {
  await db.settings.put({ key: 'bankInfo', value: JSON.stringify(info) })
}

export async function saveSetting(key: string, value: string): Promise<void> {
  await db.settings.put({ key, value })
}

export async function saveLogoBase64(base64: string): Promise<void> {
  await db.settings.put({ key: 'logoBase64', value: base64 })
}
