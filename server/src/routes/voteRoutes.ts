import { Router } from "express";
import { vote } from "../controllers/voteController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, vote);

export default router;
