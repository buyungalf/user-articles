import mongoose from "mongoose";

const pageViewSchema = new mongoose.Schema({
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  viewedAt: { type: Date, default: Date.now },
});

export default mongoose.model("PageView", pageViewSchema);
