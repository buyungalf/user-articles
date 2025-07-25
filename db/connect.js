import mongoose from "mongoose";

const connectDB = (url) => {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

export default connectDB;
