import prisma from "../config/db";
import { createCommunitySchema } from "../utils/validators";

export class CommunityService {
  async create(data: { name: string; description?: string }, userId: string) {
    const validated = createCommunitySchema.parse(data);

    const slug = validated.name.toLowerCase().replace(/\s+/g, "-");

    const existing = await prisma.community.findFirst({
      where: { OR: [{ name: validated.name }, { slug }] },
    });

    if (existing) {
      throw { status: 400, message: "Community name already taken" };
    }

    const community = await prisma.community.create({
      data: {
        name: validated.name,
        slug,
        description: validated.description,
        creatorId: userId,
        members: {
          create: { userId },
        },
      },
      include: {
        creator: {
          select: { id: true, username: true, avatar: true },
        },
        _count: {
          select: { members: true, posts: true },
        },
      },
    });

    return community;
  }

  async getAll() {
    const communities = await prisma.community.findMany({
      include: {
        creator: {
          select: { id: true, username: true, avatar: true },
        },
        _count: {
          select: { members: true, posts: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return communities;
  }

  async getBySlug(slug: string) {
    const community = await prisma.community.findUnique({
      where: { slug },
      include: {
        creator: {
          select: { id: true, username: true, avatar: true },
        },
        _count: {
          select: { members: true, posts: true },
        },
      },
    });

    if (!community) {
      throw { status: 404, message: "Community not found" };
    }

    return community;
  }

  async join(communityId: string, userId: string) {
    const existing = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: { userId, communityId },
      },
    });

    if (existing) {
      // Leave community
      await prisma.communityMember.delete({
        where: { userId_communityId: { userId, communityId } },
      });
      return { joined: false };
    }

    // Join community
    await prisma.communityMember.create({
      data: { userId, communityId },
    });

    return { joined: true };
  }
}

export const communityService = new CommunityService();
