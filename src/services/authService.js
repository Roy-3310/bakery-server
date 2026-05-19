import User from '../models/User.js'
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokenUtils.js'
import { createError } from '../middleware/errorHandler.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function register(data) {
  const existing = await User.findOne({ email: data.email })
  if (existing) throw createError(MSG.EMAIL_EXISTS, HTTP.CONFLICT)

  const hashedPassword = await hashPassword(data.password)
  const user = await User.create({ ...data, password: hashedPassword })

  const accessToken = signAccessToken(user._id)
  const refreshToken = signRefreshToken(user._id)
  user.refreshToken = refreshToken
  await user.save()

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  }
}

export async function login(email, password) {
  const user = await User.findOne({ email })
  if (!user) throw createError(MSG.INVALID_CREDENTIALS, HTTP.UNAUTHORIZED)

  const isMatch = await comparePassword(password, user.password)
  if (!isMatch) throw createError(MSG.INVALID_CREDENTIALS, HTTP.UNAUTHORIZED)

  const accessToken = signAccessToken(user._id)
  const refreshToken = signRefreshToken(user._id)
  user.refreshToken = refreshToken
  await user.save()

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  }
}

export async function refresh(token) {
  let payload
  try {
    payload = verifyRefreshToken(token)
  } catch {
    throw createError(MSG.TOKEN_INVALID, HTTP.UNAUTHORIZED)
  }

  const user = await User.findById(payload.sub)
  if (!user || user.refreshToken !== token) {
    throw createError(MSG.TOKEN_INVALID, HTTP.UNAUTHORIZED)
  }

  const accessToken = signAccessToken(user._id)
  const newRefreshToken = signRefreshToken(user._id)
  user.refreshToken = newRefreshToken
  await user.save()

  return { accessToken, refreshToken: newRefreshToken }
}

export async function logout(userId) {
  await User.findByIdAndUpdate(userId, { refreshToken: null })
}
