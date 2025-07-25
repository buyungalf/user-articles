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

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: Manajemen artikel (publik & user terautentikasi)
 */

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Ambil semua artikel yang berstatus "published"
 *     tags: [Articles]
 *     responses:
 *       200:
 *         description: Daftar artikel berhasil diambil
 */
router.get("/", getAllPublishedArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Ambil detail artikel berdasarkan ID
 *     tags: [Articles]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID artikel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail artikel berhasil diambil
 *       403:
 *         description: Akses ditolak untuk artikel draft
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.get("/:id", getArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Buat artikel baru (hanya untuk user login)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: Cara Menjadi Programmer Hebat
 *               content:
 *                 type: string
 *                 example: Belajar setiap hari dan praktek rutin...
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *                 example: draft
 *     responses:
 *       201:
 *         description: Artikel berhasil dibuat
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   patch:
 *     summary: Update artikel (hanya oleh penulis aslinya)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID artikel
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       200:
 *         description: Artikel berhasil diperbarui
 *       403:
 *         description: Akses ditolak (bukan author)
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.patch("/:id", authenticate, updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Hapus artikel (hanya oleh penulis aslinya)
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID artikel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Artikel berhasil dihapus
 *       403:
 *         description: Akses ditolak (bukan author)
 *       404:
 *         description: Artikel tidak ditemukan
 */
router.delete("/:id", authenticate, deleteArticle);

export default router;
