import * as authService from '../services/authService.js'
import { registerSchema, loginSchema, refreshSchema } from '../validation/authValidation.js'
import { success, fail } from '../utils/responseUtils.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function register(req, res, next) {
  try {
    const { error, value } = registerSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return fail(res, MSG.VALIDATION_ERROR, HTTP.BAD_REQUEST, error.details.map((d) => d.message))
    }
    const result = await authService.register(value)
    return success(res, result, MSG.REGISTER_SUCCESS, HTTP.CREATED)
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return fail(res, MSG.VALIDATION_ERROR, HTTP.BAD_REQUEST, error.details.map((d) => d.message))
    }
    const result = await authService.login(value.email, value.password)
    return success(res, result, MSG.LOGIN_SUCCESS)
  } catch (err) {
    next(err)
  }
}

export async function refresh(req, res, next) {
  try {
    const { error, value } = refreshSchema.validate(req.body)
    if (error) {
      return fail(res, MSG.TOKEN_INVALID, HTTP.UNAUTHORIZED)
    }
    const tokens = await authService.refresh(value.refreshToken)
    return success(res, tokens, '刷新成功')
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  try {
    await authService.logout(req.user._id)
    return success(res, null, MSG.LOGOUT_SUCCESS)
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res) {
  const { _id, name, email, role } = req.user
  return success(res, { id: _id, name, email, role })
}
