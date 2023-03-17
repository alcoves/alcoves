import { Injectable } from '@nestjs/common';

@Injectable()
export class InvitesService {
  create() {
    return 'This action adds a new invite';
  }

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
