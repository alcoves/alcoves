// import { Role } from '@prisma/client';
// import { Roles } from '../roles/roles.decorator';
import { InvitesService } from './invites.service';
import { Controller, Get, Post, Param, Delete } from '@nestjs/common';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  // @Roles(Role.ADMIN)
  create() {
    return this.invitesService.create();
  }

  @Get()
  // @Roles(Role.ADMIN)
  findAll() {
    return this.invitesService.findAll();
  }

  @Get(':id')
  // @Roles(Role.USER)
  findOne(@Param('id') id: string) {
    return this.invitesService.findOne(id);
  }

  @Delete(':id')
  // @Roles(Role.ADMIN)
  deleteOne(@Param('id') id: string) {
    return this.invitesService.removeOne(id);
  }
}
