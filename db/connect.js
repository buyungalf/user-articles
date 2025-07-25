import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("[LOG] MongoDB connected"))
    .catch((err) => console.error("[LOG] MongoDB connection error:", err));
};

export default connectDB;
