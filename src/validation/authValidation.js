import Joi from 'joi'

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': '姓名至少需要 2 個字',
    'any.required': '請填寫姓名',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Email 格式不正確',
    'any.required': '請填寫 Email',
  }),
  password: Joi.string().min(8).max(100).required().messages({
    'string.min': '密碼至少需要 8 個字元',
    'any.required': '請填寫密碼',
  }),
  role: Joi.string().valid('admin', 'staff').default('staff'),
})

export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Email 格式不正確',
    'any.required': '請填寫 Email',
  }),
  password: Joi.string().required().messages({
    'any.required': '請填寫密碼',
  }),
})

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': '請提供 Refresh Token',
  }),
})
