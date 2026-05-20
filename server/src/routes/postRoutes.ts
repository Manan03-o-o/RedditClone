import { Router } from "express";
import { createPost, getAllPosts, getPostById } from "../controllers/postController";
import { authMiddleware, optionalAuth } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/", optionalAuth, getAllPosts);
router.get("/:id", optionalAuth, getPostById);

export default router;
