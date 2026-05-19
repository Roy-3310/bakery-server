import Product from '../models/Product.js'
import { createError } from '../middleware/errorHandler.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function getAllProducts(query = {}) {
  const filter = {}
  if (query.category && query.category !== 'all') filter.category = query.category
  if (query.featured === 'true') filter.isFeatured = true
  if (query.badge) filter.badge = query.badge

  const page = Math.max(parseInt(query.page) || 1, 1)
  const limit = Math.min(parseInt(query.limit) || 20, 100)
  const skip = (page - 1) * limit

  const [products, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ])

  return { products, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getProductById(id) {
  const product = await Product.findById(id)
  if (!product) throw createError(MSG.PRODUCT_NOT_FOUND, HTTP.NOT_FOUND)
  return product
}

export async function createProduct(data) {
  return Product.create(data)
}

export async function updateProduct(id, data) {
  const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  if (!product) throw createError(MSG.PRODUCT_NOT_FOUND, HTTP.NOT_FOUND)
  return product
}

export async function deleteProduct(id) {
  const product = await Product.findByIdAndDelete(id)
  if (!product) throw createError(MSG.PRODUCT_NOT_FOUND, HTTP.NOT_FOUND)
}

export async function updateProductImage(id, imagePath) {
  return updateProduct(id, { image: imagePath })
}
