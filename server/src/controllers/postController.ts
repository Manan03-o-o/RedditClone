import { Request, Response, NextFunction } from "express";
import { postService } from "../services/postService";
import { sendSuccess, sendError } from "../utils/response";

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await postService.create(req.body, req.user!.id, req.file);
    sendSuccess(res, post, "Post created successfully", 201);
  } catch (error: any) {
    if (error.status) {
      sendError(res, error.message, error.status);
      return;
    }
    next(error);
  }
};

export const getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await postService.getAll(req.query as any, req.user?.id);
    sendSuccess(res, result);
  } catch (error: any) {
    next(error);
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const post = await postService.getById(req.params.id as string, req.user?.id);
    sendSuccess(res, post);
  } catch (error: any) {
    if (error.status) {
      sendError(res, error.message, error.status);
      return;
    }
    next(error);
  }
};
