import { Router } from 'express'
import * as orderController from '../controllers/orderController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'

const router = Router()

router.post('/', orderController.createOrder)
router.get('/', requireAdmin, orderController.getOrders)
router.get('/:id', orderController.getOrder)
router.patch('/:id/status', requireAdmin, orderController.updateOrderStatus)

export default router
