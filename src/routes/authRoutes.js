import { Router } from 'express'
import * as authController from '../controllers/authController.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { authLimiter } from '../middleware/rateLimiter.js'

const router = Router()

router.post('/register', authLimiter, authController.register)
router.post('/login', authLimiter, authController.login)
router.post('/refresh', authController.refresh)
router.post('/logout', requireAuth, authController.logout)
router.get('/me', requireAuth, authController.getMe)

export default router
