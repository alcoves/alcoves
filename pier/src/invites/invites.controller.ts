import { InvitesService } from './invites.service';
import { CheckAbilities } from '../ability/abilities.decorator';
import { Controller, Get, Post, Param, Delete } from '@nestjs/common';

@Controller('invites')
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @CheckAbilities({ action: 'create', subject: 'invites' })
  create() {
    return this.invitesService.create();
  }

  @Get()
  @CheckAbilities({ action: 'read', subject: 'invites' })
  findAll() {
    return this.invitesService.findAll();
  }

  @Get(':id')
  @CheckAbilities({ action: 'read', subject: 'invites' })
  findOne(@Param('id') id: string) {
    return this.invitesService.findOne(id);
  }

  @Delete(':id')
  @CheckAbilities({ action: 'delete', subject: 'invites' })
  deleteOne(@Param('id') id: string) {
    return this.invitesService.removeOne(id);
  }
}
