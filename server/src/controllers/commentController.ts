import { Request, Response, NextFunction } from "express";
import { commentService } from "../services/commentService";
import { sendSuccess, sendError } from "../utils/response";

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const comment = await commentService.create(req.body, req.user!.id);
    sendSuccess(res, comment, "Comment created", 201);
  } catch (error: any) {
    if (error.status) {
      sendError(res, error.message, error.status);
      return;
    }
    next(error);
  }
};

export const getCommentsByPostId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const comments = await commentService.getByPostId(req.params.postId as string);
    sendSuccess(res, comments);
  } catch (error: any) {
    next(error);
  }
};
