export function success(res, data, message = '成功', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data })
}

export function fail(res, message, statusCode = 400, errors = null) {
  const body = { success: false, message }
  if (errors) body.errors = errors
  return res.status(statusCode).json(body)
}
