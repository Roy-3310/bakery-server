import { Router } from 'express'
import * as productController from '../controllers/productController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = Router()

router.get('/', productController.getProducts)
router.get('/:id', productController.getProduct)
router.post('/', requireAdmin, upload.single('image'), productController.createProduct)
router.put('/:id', requireAdmin, productController.updateProduct)
router.delete('/:id', requireAdmin, productController.deleteProduct)
router.post('/:id/image', requireAdmin, upload.single('image'), productController.uploadProductImage)

export default router
