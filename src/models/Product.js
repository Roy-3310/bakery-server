import mongoose from 'mongoose'

const CATEGORIES = ['croissant', 'bread', 'pastry', 'toast', 'seasonal', 'gift']
const BADGES = ['推薦', '季節限定', '新品', '熱銷']

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameEn: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: CATEGORIES },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    isFeatured: { type: Boolean, default: false },
    badge: { type: String, enum: BADGES, default: null },
  },
  { timestamps: true }
)

productSchema.index({ category: 1 })
productSchema.index({ isFeatured: 1 })

export default mongoose.model('Product', productSchema)
