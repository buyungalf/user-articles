import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API untuk manajemen user
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Mendapatkan semua user (public)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan list user
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Mendapatkan detail user berdasarkan ID (public)
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detail user ditemukan
 *       404:
 *         description: User tidak ditemukan
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Membuat user baru (login required)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               username:
 *                 type: string
 *                 example: janedoe
 *               password:
 *                 type: string
 *                 example: mysecurepass
 *     responses:
 *       201:
 *         description: User berhasil dibuat
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Memperbarui user berdasarkan ID (login required, hanya user sendiri)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe Updated
 *               password:
 *                 type: string
 *                 example: newpassword
 *     responses:
 *       200:
 *         description: User berhasil diperbarui
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: User tidak ditemukan
 */
router.patch("/:id", authenticate, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Menghapus user berdasarkan ID (login required, hanya user sendiri)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User berhasil dihapus
 *       403:
 *         description: Akses ditolak
 *       404:
 *         description: User tidak ditemukan
 */
router.delete("/:id", authenticate, deleteUser);

export default router;
