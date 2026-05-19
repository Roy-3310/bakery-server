import Joi from 'joi'

export const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'string.min': '姓名至少需要 2 個字',
    'any.required': '請填寫姓名',
  }),
  email: Joi.string().email().lowercase().required().messages({
    'string.email': 'Email 格式不正確',
    'any.required': '請填寫 Email',
  }),
  message: Joi.string().trim().min(10).max(1000).required().messages({
    'string.min': '訊息至少需要 10 個字',
    'any.required': '請填寫訊息內容',
  }),
})
