import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import { connectDB } from './config/db.js'
import { initPassport } from './config/passport.js'
import { apiLimiter } from './middleware/rateLimiter.js'
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initPassport()
app.use(passport.initialize())

app.use('/api', apiLimiter)
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/contact', contactRoutes)

app.use(notFoundHandler)
app.use(globalErrorHandler)

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server 啟動於 http://localhost:${PORT}`))
})
