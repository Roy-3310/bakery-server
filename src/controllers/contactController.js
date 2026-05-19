import * as contactService from '../services/contactService.js'
import { contactSchema } from '../validation/contactValidation.js'
import { success, fail } from '../utils/responseUtils.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function submitMessage(req, res, next) {
  try {
    const { error, value } = contactSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return fail(res, MSG.VALIDATION_ERROR, HTTP.BAD_REQUEST, error.details.map((d) => d.message))
    }
    const msg = await contactService.submitMessage(value)
    return success(res, msg, MSG.CONTACT_SENT, HTTP.CREATED)
  } catch (err) {
    next(err)
  }
}

export async function getMessages(req, res, next) {
  try {
    const result = await contactService.getAllMessages(req.query)
    return success(res, result)
  } catch (err) {
    next(err)
  }
}

export async function markAsRead(req, res, next) {
  try {
    const msg = await contactService.markAsRead(req.params.id)
    return success(res, msg, '已標記為已讀')
  } catch (err) {
    next(err)
  }
}
