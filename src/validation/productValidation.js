import Joi from 'joi'

const CATEGORIES = ['croissant', 'bread', 'pastry', 'toast', 'seasonal', 'gift']
const BADGES = ['推薦', '季節限定', '新品', '熱銷']

export const createProductSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': '請填寫商品名稱',
  }),
  nameEn: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': '請填寫商品英文名稱',
  }),
  price: Joi.number().min(0).required().messages({
    'number.min': '價格不能為負數',
    'any.required': '請填寫價格',
  }),
  category: Joi.string().valid(...CATEGORIES).required().messages({
    'any.only': `分類必須是 ${CATEGORIES.join(', ')} 其中之一`,
    'any.required': '請選擇商品分類',
  }),
  description: Joi.string().trim().min(1).max(200).required().messages({
    'any.required': '請填寫商品簡述',
  }),
  longDescription: Joi.string().trim().min(1).max(1000).required().messages({
    'any.required': '請填寫商品詳細描述',
  }),
  image: Joi.string().optional(),
  stock: Joi.number().integer().min(0).default(0),
  isFeatured: Joi.boolean().default(false),
  badge: Joi.string().valid(...BADGES).allow(null).default(null),
})

export const updateProductSchema = createProductSchema.fork(
  ['name', 'nameEn', 'price', 'category', 'description', 'longDescription', 'image'],
  (field) => field.optional()
)
