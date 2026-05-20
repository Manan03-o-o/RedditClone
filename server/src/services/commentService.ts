import prisma from "../config/db";
import { createCommentSchema } from "../utils/validators";

export class CommentService {
  async create(data: { content: string; postId: string; parentId?: string }, userId: string) {
    const validated = createCommentSchema.parse(data);

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: validated.postId },
    });

    if (!post) {
      throw { status: 404, message: "Post not found" };
    }

    // Verify parent comment exists if parentId provided
    if (validated.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: validated.parentId },
      });
      if (!parent) {
        throw { status: 404, message: "Parent comment not found" };
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content: validated.content,
        authorId: userId,
        postId: validated.postId,
        parentId: validated.parentId,
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
      },
    });

    return comment;
  }

  async getByPostId(postId: string) {
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only top-level comments
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
        replies: {
          include: {
            author: {
              select: { id: true, username: true, avatar: true },
            },
            replies: {
              include: {
                author: {
                  select: { id: true, username: true, avatar: true },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  }
}

export const commentService = new CommentService();
