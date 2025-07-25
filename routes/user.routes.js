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

// Public routes
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// Protected
router.post("/", authenticate, createUser);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, deleteUser);

export default router;
