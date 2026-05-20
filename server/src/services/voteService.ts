import prisma from "../config/db";
import { voteSchema } from "../utils/validators";

export class VoteService {
  async vote(data: { postId: string; value: number }, userId: string) {
    const validated = voteSchema.parse(data);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: validated.postId },
    });

    if (!post) {
      throw { status: 404, message: "Post not found" };
    }

    // Check existing vote
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: { userId, postId: validated.postId },
      },
    });

    if (existingVote) {
      if (existingVote.value === validated.value) {
        // Same vote = remove vote (toggle off)
        await prisma.vote.delete({
          where: { id: existingVote.id },
        });
        return { voteScore: await this.getVoteScore(validated.postId), userVote: 0 };
      } else {
        // Different vote = update
        await prisma.vote.update({
          where: { id: existingVote.id },
          data: { value: validated.value },
        });
        return { voteScore: await this.getVoteScore(validated.postId), userVote: validated.value };
      }
    }

    // New vote
    await prisma.vote.create({
      data: {
        value: validated.value,
        userId,
        postId: validated.postId,
      },
    });

    return { voteScore: await this.getVoteScore(validated.postId), userVote: validated.value };
  }

  private async getVoteScore(postId: string): Promise<number> {
    const votes = await prisma.vote.findMany({
      where: { postId },
    });
    return votes.reduce((sum: number, vote: any) => sum + vote.value, 0);
  }
}

export const voteService = new VoteService();
