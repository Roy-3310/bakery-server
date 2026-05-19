import Joi from 'joi'

const orderItemSchema = Joi.object({
  productId: Joi.string().required().messages({
    'any.required': '商品 ID 為必填',
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.min': '數量至少為 1',
    'any.required': '請填寫商品數量',
  }),
})

export const createOrderSchema = Joi.object({
  customer: Joi.object({
    name: Joi.string().trim().min(2).max(50).required().messages({
      'any.required': '請填寫姓名',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Email 格式不正確',
      'any.required': '請填寫 Email',
    }),
    phone: Joi.string()
      .pattern(/^09\d{8}$/)
      .required()
      .messages({
        'string.pattern.base': '請填寫正確的手機號碼格式（09xxxxxxxx）',
        'any.required': '請填寫手機號碼',
      }),
    address: Joi.string().trim().min(5).max(200).required().messages({
      'any.required': '請填寫收件地址',
    }),
    note: Joi.string().max(500).allow('').default(''),
  }).required(),
  items: Joi.array().items(orderItemSchema).min(1).required().messages({
    'array.min': '訂單至少需要一件商品',
    'any.required': '請提供訂購商品',
  }),
})

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')
    .required()
    .messages({
      'any.required': '請提供訂單狀態',
    }),
  paymentStatus: Joi.string().valid('unpaid', 'paid', 'refunded'),
})
