import { Request, Response, NextFunction } from "express";
import { communityService } from "../services/communityService";
import { sendSuccess, sendError } from "../utils/response";

export const createCommunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const community = await communityService.create(req.body, req.user!.id);
    sendSuccess(res, community, "Community created successfully", 201);
  } catch (error: any) {
    if (error.status) {
      sendError(res, error.message, error.status);
      return;
    }
    next(error);
  }
};

export const getAllCommunities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const communities = await communityService.getAll();
    sendSuccess(res, communities);
  } catch (error: any) {
    next(error);
  }
};

export const getCommunityBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const community = await communityService.getBySlug(req.params.slug as string);
    sendSuccess(res, community);
  } catch (error: any) {
    if (error.status) {
      sendError(res, error.message, error.status);
      return;
    }
    next(error);
  }
};

export const joinCommunity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await communityService.join(req.params.id as string, req.user!.id);
    sendSuccess(res, result, result.joined ? "Joined community" : "Left community");
  } catch (error: any) {
    if (error.status) {
      sendError(res, error.message, error.status);
      return;
    }
    next(error);
  }
};
