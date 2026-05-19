import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { createError } from '../middleware/errorHandler.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function createOrder(data) {
  const { customer, items: rawItems } = data

  const productIds = rawItems.map((i) => i.productId)
  const products = await Product.find({ _id: { $in: productIds } })

  const productMap = new Map(products.map((p) => [p._id.toString(), p]))

  const orderItems = []
  let totalAmount = 0

  for (const raw of rawItems) {
    const product = productMap.get(raw.productId)
    if (!product) throw createError(`商品 ${raw.productId} 不存在`, HTTP.BAD_REQUEST)
    if (product.stock < raw.quantity) {
      throw createError(`${product.name} ${MSG.INSUFFICIENT_STOCK}`, HTTP.BAD_REQUEST)
    }
    orderItems.push({
      productId: product._id,
      name: product.name,
      nameEn: product.nameEn,
      price: product.price,
      quantity: raw.quantity,
      image: product.image,
    })
    totalAmount += product.price * raw.quantity
  }

  const order = await Order.create({ customer, items: orderItems, totalAmount })

  await Promise.all(
    orderItems.map(({ productId, quantity }) =>
      Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } })
    )
  )

  return order
}

export async function getAllOrders(query = {}) {
  const filter = {}
  if (query.status) filter.status = query.status

  const page = Math.max(parseInt(query.page) || 1, 1)
  const limit = Math.min(parseInt(query.limit) || 20, 100)
  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(filter),
  ])

  return { orders, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getOrderById(id) {
  const order = await Order.findById(id)
  if (!order) throw createError(MSG.ORDER_NOT_FOUND, HTTP.NOT_FOUND)
  return order
}

export async function updateOrderStatus(id, data) {
  const order = await Order.findByIdAndUpdate(id, data, { new: true, runValidators: true })
  if (!order) throw createError(MSG.ORDER_NOT_FOUND, HTTP.NOT_FOUND)
  return order
}
