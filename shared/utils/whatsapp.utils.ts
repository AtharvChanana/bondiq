export function buildWhatsAppUrl(message: string, phone?: string | null) {
  const encoded = encodeURIComponent(message)
  const cleanedPhone = phone?.replace(/[^\d]/g, "")
  if (cleanedPhone) return `https://wa.me/${cleanedPhone}?text=${encoded}`
  return `https://wa.me/?text=${encoded}`
}
