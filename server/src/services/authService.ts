import bcrypt from "bcryptjs";
import prisma from "../config/db";
import { generateToken } from "../utils/generateToken";
import { registerSchema, loginSchema } from "../utils/validators";

export class AuthService {
  async register(data: { email: string; username: string; password: string }) {
    const validated = registerSchema.parse(data);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: validated.email }, { username: validated.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === validated.email) {
        throw { status: 400, message: "Email already in use" };
      }
      throw { status: 400, message: "Username already taken" };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        username: validated.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
      },
    });

    const token = generateToken({ id: user.id, email: user.email, username: user.username });

    return { user, token };
  }

  async login(data: { email: string; password: string }) {
    const validated = loginSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: validated.email },
    });

    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(validated.password, user.password);

    if (!isMatch) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const token = generateToken({ id: user.id, email: user.email, username: user.username });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    return user;
  }
}

export const authService = new AuthService();
