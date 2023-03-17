import { Invite } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InvitesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(): Promise<Invite> {
    const invite = this.prismaService.invite.create({ data: {} });
    return invite;
  }

  async findAll(): Promise<Invite[]> {
    const invites = await this.prismaService.invite.findMany();
    return invites;
  }

  async findOne(id: string): Promise<Invite> {
    const invite = await this.prismaService.invite.findUnique({
      where: { id },
    });
    return invite;
  }

  async removeOne(id: string) {
    await this.prismaService.invite.delete({
      where: { id },
    });
  }
}
