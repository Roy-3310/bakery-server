import { supabase } from '../config/supabase.js'
import path from 'path'

const BUCKET = 'products'

export async function uploadImage(file) {
  const ext = path.extname(file.originalname).toLowerCase()
  const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    })

  if (error) throw new Error(`圖片上傳失敗：${error.message}`)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename)
  return data.publicUrl
}
