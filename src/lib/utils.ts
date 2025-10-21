import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, addDays, isAfter, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export function formatDate(date: Date | string, formatStr: string = 'dd/MM/yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return format(dateObj, formatStr, { locale: ptBR })
}

export function formatTime(time: string): string {
  return format(new Date(`2000-01-01T${time}`), 'HH:mm')
}

export function getMinDate(): Date {
  return addDays(new Date(), 1) // 24h from now
}

export function getMaxDate(): Date {
  return addDays(new Date(), 90) // 90 days from now
}

export function isDateAvailable(date: Date): boolean {
  const minDate = getMinDate()
  const maxDate = getMaxDate()
  
  return isAfter(date, minDate) && isBefore(date, maxDate)
}

// Phone formatting
export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 2) {
    return numbers
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }
}

// CPF formatting
export function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '')
  
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3)}`
  } else if (numbers.length <= 9) {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`
  } else {
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`
  }
}

// CPF validation
export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '')
  
  if (numbers.length !== 11) return false
  
  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(numbers)) return false
  
  // Calculate first digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers[i]) * (10 - i)
  }
  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder
  
  if (parseInt(numbers[9]) !== firstDigit) return false
  
  // Calculate second digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers[i]) * (11 - i)
  }
  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder
  
  return parseInt(numbers[10]) === secondDigit
}

// Generate time slots
export function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = []
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  
  let current = new Date(start)
  
  while (current < end) {
    slots.push(format(current, 'HH:mm'))
    current.setHours(current.getHours() + 1)
  }
  
  return slots
}

// Status colors
export function getStatusColor(status: string): string {
  switch (status) {
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800'
    case 'confirmado':
      return 'bg-green-100 text-green-800'
    case 'cancelado':
      return 'bg-red-100 text-red-800'
    case 'concluido':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// WhatsApp URL generator
export function generateWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`
}

// File processing for images
export function processImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    img.onload = () => {
      // Resize to 400x400
      canvas.width = 400
      canvas.height = 400
      
      ctx?.drawImage(img, 0, 0, 400, 400)
      
      // Convert to WebP with 80% quality
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Failed to process image'))
        },
        'image/webp',
        0.8
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}
