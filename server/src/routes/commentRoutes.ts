import { Router } from "express";
import { createComment, getCommentsByPostId } from "../controllers/commentController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createComment);
router.get("/:postId", getCommentsByPostId);

export default router;
