import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createCommunitySchema = z.object({
  name: z
    .string()
    .min(3, "Community name must be at least 3 characters")
    .max(21, "Community name must be at most 21 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Community name can only contain letters, numbers, and underscores"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
});

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(300, "Title must be at most 300 characters"),
  content: z.string().max(40000, "Content is too long").optional(),
  communityId: z.string().min(1, "Community is required"),
});

export const createCommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(10000, "Comment is too long"),
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional(),
});

export const voteSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  value: z.number().refine((v) => v === 1 || v === -1, {
    message: "Vote value must be 1 or -1",
  }),
});
