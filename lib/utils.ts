import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(date: Date | string): string {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export function isDateExpired(date: Date | string): boolean {
  if (!date) return false
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d < today
}

export function getDaysUntilExpiration(date: Date | string): number {
  if (!date) return 0
  const d = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffTime = d.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function getExpirationStatus(date: Date | string): 'expired' | 'warning' | 'valid' {
  const days = getDaysUntilExpiration(date)
  if (days < 0) return 'expired'
  if (days <= 30) return 'warning'
  return 'valid'
}
