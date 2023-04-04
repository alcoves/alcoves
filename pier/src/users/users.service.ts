import { Prisma, User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../svc/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(): Promise<any[]> {
    const users = await this.prismaService.user.findMany();
    return users;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    return user || undefined;
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    return user || undefined;
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    return user || undefined;
  }

  async updateOne(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    const user = await this.prismaService.user.update({
      where: { id },
      data,
    });

    return user || undefined;
  }

  async createOne({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }): Promise<User> {
    const user = this.prismaService.user.create({
      data: {
        email,
        username,
        password,
      },
    });

    if (user) {
      delete user['password'];
    }
    return user;
  }

  async remove(id: string): Promise<'OK'> {
    await this.prismaService.user.delete({
      where: { id },
    });
    return `OK`;
  }
}
