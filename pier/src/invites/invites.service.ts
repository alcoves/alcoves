import { Injectable, UseGuards } from '@nestjs/common';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';

@Injectable()
export class InvitesService {
  @UseGuards(JwtAuthGuard)
  create(createInviteDto: CreateInviteDto) {
    return 'This action adds a new invite';
  }

  @UseGuards(JwtAuthGuard)
  findAll() {
    return `This action returns all invites`;
    // return the invite code
    return '123';
  }

  findOne(id: number) {
    return `This action returns a #${id} invite`;
  }

  // update(id: number, updateInviteDto: UpdateInviteDto) {
  //   return `This action updates a #${id} invite`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} invite`;
  // }
}
