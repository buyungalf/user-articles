import express from "express";
import {
  createPageView,
  countPageViews,
  aggregatePageViewsByDate,
} from "../controllers/pageView.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createPageView);
router.get("/count", authenticate, countPageViews);
router.get("/aggregate-date", authenticate, aggregatePageViewsByDate);

export default router;
