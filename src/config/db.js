import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB 連線成功");
  } catch (err) {
    console.error("MongoDB 連線失敗:", err.message);
    process.exit(1);
  }
}
