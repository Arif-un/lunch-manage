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
