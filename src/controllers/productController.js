import * as productService from '../services/productService.js'
import * as storageService from '../services/storageService.js'
import { createProductSchema, updateProductSchema } from '../validation/productValidation.js'
import { success, fail } from '../utils/responseUtils.js'
import { MSG } from '../constants/messages.js'
import { HTTP } from '../constants/httpStatus.js'

export async function getProducts(req, res, next) {
  try {
    const result = await productService.getAllProducts(req.query)
    return success(res, result)
  } catch (err) {
    next(err)
  }
}

export async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id)
    return success(res, product)
  } catch (err) {
    next(err)
  }
}

export async function createProduct(req, res, next) {
  try {
    const { error, value } = createProductSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return fail(res, MSG.VALIDATION_ERROR, HTTP.BAD_REQUEST, error.details.map((d) => d.message))
    }

    if (req.file) {
      value.image = await storageService.uploadImage(req.file)
    }

    if (!value.image) {
      return fail(res, '請提供商品圖片', HTTP.BAD_REQUEST)
    }

    const product = await productService.createProduct(value)
    return success(res, product, MSG.PRODUCT_CREATED, HTTP.CREATED)
  } catch (err) {
    next(err)
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { error, value } = updateProductSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return fail(res, MSG.VALIDATION_ERROR, HTTP.BAD_REQUEST, error.details.map((d) => d.message))
    }
    const product = await productService.updateProduct(req.params.id, value)
    return success(res, product, MSG.PRODUCT_UPDATED)
  } catch (err) {
    next(err)
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(req.params.id)
    return success(res, null, MSG.PRODUCT_DELETED)
  } catch (err) {
    next(err)
  }
}

export async function uploadProductImage(req, res, next) {
  try {
    if (!req.file) {
      return fail(res, '請上傳圖片檔案', HTTP.BAD_REQUEST)
    }
    const imageUrl = await storageService.uploadImage(req.file)
    const product = await productService.updateProductImage(req.params.id, imageUrl)
    return success(res, { product, imageUrl }, '圖片上傳成功')
  } catch (err) {
    next(err)
  }
}
