import Contact from '../models/Contact.js'
import { createError } from '../middleware/errorHandler.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function submitMessage(data) {
  return Contact.create(data)
}

export async function getAllMessages(query = {}) {
  const filter = {}
  if (query.isRead !== undefined) filter.isRead = query.isRead === 'true'

  const page = Math.max(parseInt(query.page) || 1, 1)
  const limit = Math.min(parseInt(query.limit) || 20, 100)
  const skip = (page - 1) * limit

  const [messages, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Contact.countDocuments(filter),
  ])

  return { messages, total, page, totalPages: Math.ceil(total / limit) }
}

export async function markAsRead(id) {
  const msg = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true })
  if (!msg) throw createError(MSG.CONTACT_NOT_FOUND, HTTP.NOT_FOUND)
  return msg
}
