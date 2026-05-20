import { Request, Response, NextFunction } from "express";
import { voteService } from "../services/voteService";
import { sendSuccess, sendError } from "../utils/response";

export const vote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await voteService.vote(req.body, req.user!.id);
    sendSuccess(res, result);
  } catch (error: any) {
    if (error.status) {
      sendError(res, error.message, error.status);
      return;
    }
    next(error);
  }
};
