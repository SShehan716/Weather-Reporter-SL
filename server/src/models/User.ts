import { prisma } from '../db';
import { User as PrismaUser } from '@prisma/client';

export type UserProfile = Omit<PrismaUser, 'password' | 'verification_token' | 'is_verified'>;

export class UserModel {
  // Find a user by either email or username
  static async findByIdentifier(identifier: string): Promise<PrismaUser | null> {
    return prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });
  }

  // Find a user by their ID
  static async findById(id: number): Promise<UserProfile | null> {
    return prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        username: true,
        email: true,
        country: true,
        createdAt: true,
        updatedAt: true,
        reset_token: true,
        reset_token_expiry: true,
        lastVerificationEmailSent: true,
        lastResetEmailSent: true,
      },
    });
  }
  
  // Find a user by their verification token
  static async findByVerificationToken(token: string): Promise<PrismaUser | null> {
    return prisma.user.findFirst({
      where: { verification_token: token },
    });
  }

  // Create a new user
  static async create(data: Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt' | 'is_verified'>): Promise<PrismaUser> {
    return prisma.user.create({
      data,
    });
  }

  // Verify a user's email
  static async verify(token: string): Promise<boolean> {
    const result = await prisma.user.updateMany({
      where: {
        verification_token: token,
        is_verified: false,
      },
      data: {
        is_verified: true,
        verification_token: null,
      },
    });
    return result.count > 0;
  }

  // Update a user's profile
  static async update(id: number, data: { username: string; country?: string }): Promise<UserProfile> {
    return prisma.user.update({
      where: { id: id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        country: true,
        createdAt: true,
        updatedAt: true,
        reset_token: true,
        reset_token_expiry: true,
        lastVerificationEmailSent: true,
        lastResetEmailSent: true,
      },
    });
  }

  // Find a user by email
  static async findByEmail(email: string): Promise<PrismaUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  // Set reset token and expiry
  static async setResetToken(id: number, token: string, expiry: Date): Promise<PrismaUser> {
    return prisma.user.update({
      where: { id },
      data: { reset_token: token, reset_token_expiry: expiry }
    });
  }

  // Find a user by reset token
  static async findByResetToken(token: string): Promise<PrismaUser | null> {
    return prisma.user.findFirst({ where: { reset_token: token } });
  }

  // Update password and clear reset token
  static async updatePasswordAndClearResetToken(id: number, hashedPassword: string): Promise<PrismaUser> {
    return prisma.user.update({
      where: { id },
      data: { password: hashedPassword, reset_token: null, reset_token_expiry: null }
    });
  }

  // Get last verification email sent time
  static async getLastVerificationEmailSent(email: string): Promise<Date | null> {
    const user = await prisma.user.findUnique({ where: { email }, select: { lastVerificationEmailSent: true } });
    return user?.lastVerificationEmailSent || null;
  }

  // Update last verification email sent time
  static async updateLastVerificationEmailSent(email: string, date: Date): Promise<void> {
    await prisma.user.update({ where: { email }, data: { lastVerificationEmailSent: date } });
  }

  // Get last reset email sent time
  static async getLastResetEmailSent(email: string): Promise<Date | null> {
    const user = await prisma.user.findUnique({ where: { email }, select: { lastResetEmailSent: true } });
    return user?.lastResetEmailSent || null;
  }

  // Update last reset email sent time
  static async updateLastResetEmailSent(email: string, date: Date): Promise<void> {
    await prisma.user.update({ where: { email }, data: { lastResetEmailSent: date } });
  }
} 