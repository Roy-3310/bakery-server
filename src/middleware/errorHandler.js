import { HTTP } from '../constants/httpStatus.js'
import { MSG } from '../constants/messages.js'

export function notFoundHandler(req, res) {
  res.status(HTTP.NOT_FOUND).json({
    success: false,
    message: `找不到路由：${req.method} ${req.originalUrl}`,
  })
}

export function globalErrorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${err.stack || err.message}`)

  if (err.name === 'ValidationError') {
    return res.status(HTTP.UNPROCESSABLE).json({
      success: false,
      message: MSG.VALIDATION_ERROR,
      errors: Object.values(err.errors).map((e) => e.message),
    })
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(HTTP.CONFLICT).json({
      success: false,
      message: `${field} 已存在，請使用其他值`,
    })
  }

  const statusCode = err.statusCode || HTTP.INTERNAL_ERROR
  const message = err.isOperational ? err.message : MSG.SERVER_ERROR

  res.status(statusCode).json({ success: false, message })
}

export function createError(message, statusCode = 500) {
  const err = new Error(message)
  err.statusCode = statusCode
  err.isOperational = true
  return err
}
