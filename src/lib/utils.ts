import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 *
 * @param {...any} inputs
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 *
 * @param sqlDate
 */
export function dateToLocal(sqlDate: string) {
  return new Date(sqlDate).toLocaleTimeString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export function dateToday() {
  const today = new Date()
  const todayFormattedDate = today.toISOString().split('T')[0]
  return todayFormattedDate
}

export const fetcher = (url: string) => fetch(url).then(res => res.json())

export const mutator = (url: string, { arg }: { arg: any }) =>
  fetch(url, { method: 'POST', body: JSON.stringify(arg) }).then(res => res.json())

export function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 1000) {
    return 'just now'
  }
  if (diff < 60000) {
    return `${Math.floor(diff / 1000)} seconds ago`
  }
  if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} minutes ago`
  }
  if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} hours ago`
  }
  if (diff < 2592000000) {
    return `${Math.floor(diff / 86400000)} days ago`
  }
  return `${Math.floor(diff / 2592000000)} months ago`
}
