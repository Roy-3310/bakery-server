import * as orderService from '../services/orderService.js'
import { createOrderSchema, updateOrderStatusSchema } from '../validation/orderValidation.js'
import { success, fail } from '../utils/responseUtils.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function createOrder(req, res, next) {
  try {
    const { error, value } = createOrderSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return fail(res, MSG.VALIDATION_ERROR, HTTP.BAD_REQUEST, error.details.map((d) => d.message))
    }
    const order = await orderService.createOrder(value)
    return success(res, order, MSG.ORDER_CREATED, HTTP.CREATED)
  } catch (err) {
    next(err)
  }
}

export async function getOrders(req, res, next) {
  try {
    const result = await orderService.getAllOrders(req.query)
    return success(res, result)
  } catch (err) {
    next(err)
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id)
    return success(res, order)
  } catch (err) {
    next(err)
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { error, value } = updateOrderStatusSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return fail(res, MSG.VALIDATION_ERROR, HTTP.BAD_REQUEST, error.details.map((d) => d.message))
    }
    const order = await orderService.updateOrderStatus(req.params.id, value)
    return success(res, order, MSG.ORDER_UPDATED)
  } catch (err) {
    next(err)
  }
}
