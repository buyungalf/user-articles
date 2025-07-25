import express from "express";
import {
  createPageView,
  countPageViews,
  aggregatePageViewsByDate,
} from "../controllers/pageView.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PageView
 *   description: API untuk pelacakan page view artikel
 */

/**
 * @swagger
 * /api/page-view:
 *   post:
 *     summary: Catat satu page view untuk artikel tertentu
 *     tags: [PageView]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - article
 *             properties:
 *               article:
 *                 type: string
 *                 description: ID dari artikel yang dibuka
 *                 example: 60f7d6b4d6e99c6f28f9a834
 *     responses:
 *       201:
 *         description: Page view berhasil dicatat
 *       400:
 *         description: Bad request
 */
router.post("/", createPageView);

/**
 * @swagger
 * /api/page-view/count:
 *   get:
 *     summary: Ambil jumlah page view (opsional dengan filter)
 *     tags: [PageView]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: article
 *         in: query
 *         description: Filter berdasarkan ID artikel
 *         schema:
 *           type: string
 *       - name: startAt
 *         in: query
 *         description: Filter dari tanggal (ISO8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-07-25T00:00:00.000Z
 *       - name: endAt
 *         in: query
 *         description: Filter hingga tanggal (ISO8601)
 *         schema:
 *           type: string
 *           format: date-time
 *           example: 2025-07-29T23:59:59.999Z
 *     responses:
 *       200:
 *         description: Berhasil mengambil jumlah page view
 *       401:
 *         description: Unauthorized
 */
router.get("/count", authenticate, countPageViews);

/**
 * @swagger
 * /api/page-view/aggregate-date:
 *   get:
 *     summary: Ambil agregasi page view berdasarkan tanggal
 *     tags: [PageView]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: interval
 *         in: query
 *         description: Interval agregasi (hourly, daily, monthly)
 *         schema:
 *           type: string
 *           enum: [hourly, daily, monthly]
 *           default: daily
 *       - name: article
 *         in: query
 *         description: ID artikel yang ingin difilter
 *         schema:
 *           type: string
 *       - name: startAt
 *         in: query
 *         description: Filter dari tanggal (ISO8601)
 *         schema:
 *           type: string
 *           format: date-time
 *       - name: endAt
 *         in: query
 *         description: Filter hingga tanggal (ISO8601)
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Berhasil mengembalikan data agregasi page view
 *       401:
 *         description: Unauthorized
 */
router.get("/aggregate-date", authenticate, aggregatePageViewsByDate);

export default router;
