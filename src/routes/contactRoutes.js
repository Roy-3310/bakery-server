import { Router } from 'express'
import * as contactController from '../controllers/contactController.js'
import { requireAdmin } from '../middleware/authMiddleware.js'
import { contactLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/', contactLimiter, contactController.submitMessage)
router.get('/', requireAdmin, contactController.getMessages)
router.patch('/:id/read', requireAdmin, contactController.markAsRead)

export default router
