import express from "express";
import {
  getAllPublishedArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/", getAllPublishedArticles);
router.get("/:id", getArticleById);

// Protected
router.post("/", authenticate, createArticle);
router.put("/:id", authenticate, updateArticle);
router.delete("/:id", authenticate, deleteArticle);

export default router;
