import prisma from "../config/db";
import { createPostSchema } from "../utils/validators";
import cloudinary from "../config/cloudinary";

export class PostService {
  async create(data: { title: string; content?: string; communityId: string }, userId: string, file?: Express.Multer.File) {
    const validated = createPostSchema.parse(data);

    // Verify community exists
    const community = await prisma.community.findUnique({
      where: { id: validated.communityId },
    });

    if (!community) {
      throw { status: 404, message: "Community not found" };
    }

    let imageUrl: string | undefined;

    if (file) {
      try {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "reddit-clone/posts", resource_type: "image" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrl = result.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        // Continue without image if upload fails
      }
    }

    const post = await prisma.post.create({
      data: {
        title: validated.title,
        content: validated.content,
        imageUrl,
        authorId: userId,
        communityId: validated.communityId,
      },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
        community: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { comments: true, votes: true },
        },
      },
    });

    return post;
  }

  async getAll(query: { sort?: string; communityId?: string; page?: string; limit?: string }, userId?: string) {
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.communityId) {
      where.communityId = query.communityId;
    }

    const orderBy: any = query.sort === "top"
      ? { votes: { _count: "desc" } }
      : { createdAt: "desc" };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: { id: true, username: true, avatar: true },
          },
          community: {
            select: { id: true, name: true, slug: true },
          },
          votes: true,
          _count: {
            select: { comments: true, votes: true },
          },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    // Calculate vote counts and user's vote
    const postsWithVotes = posts.map((post: any) => {
      const voteScore = post.votes.reduce((sum: number, vote: any) => sum + vote.value, 0);
      const userVote = userId ? post.votes.find((v: any) => v.userId === userId)?.value || 0 : 0;
      const { votes, ...postWithoutVotes } = post;
      return { ...postWithoutVotes, voteScore, userVote };
    });

    return {
      posts: postsWithVotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getById(id: string, userId?: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, username: true, avatar: true },
        },
        community: {
          select: { id: true, name: true, slug: true, description: true },
        },
        votes: true,
        _count: {
          select: { comments: true, votes: true },
        },
      },
    });

    if (!post) {
      throw { status: 404, message: "Post not found" };
    }

    const voteScore = post.votes.reduce((sum: number, vote: any) => sum + vote.value, 0);
    const userVote = userId ? post.votes.find((v: any) => v.userId === userId)?.value || 0 : 0;
    const { votes, ...postWithoutVotes } = post;

    return { ...postWithoutVotes, voteScore, userVote };
  }
}

export const postService = new PostService();
