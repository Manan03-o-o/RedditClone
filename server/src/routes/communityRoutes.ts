import { Router } from "express";
import { createCommunity, getAllCommunities, getCommunityBySlug, joinCommunity } from "../controllers/communityController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, createCommunity);
router.get("/", getAllCommunities);
router.get("/:slug", getCommunityBySlug);
router.post("/:id/join", authMiddleware, joinCommunity);

export default router;
