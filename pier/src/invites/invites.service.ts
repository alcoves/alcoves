import { Invitation } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class InvitesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create() {
    // const invite = this.prismaService.invitation.create({ data: {} });
    // return invite;
  }

  async findAll() {
    // const invites = await this.prismaService.invitation.findMany();
    // return invites;
  }

  async findOne(id: string) {
    // const invite = await this.prismaService.invitation.findUnique({
    //   where: { id },
    // });
    // return invite;
  }

  async removeOne(id: string) {
    // await this.prismaService.invitation.delete({
    //   where: { id },
    // });
  }
}
