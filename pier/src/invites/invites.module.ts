import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { InvitesService } from './invites.service';
import { InvitesController } from './invites.controller';

@Module({
  controllers: [InvitesController],
  providers: [PrismaService, InvitesService],
})
export class InvitesModule {}
