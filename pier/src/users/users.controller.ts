import { UserRole, User } from '@prisma/client';
import { UsersService } from './users.service';
import { UserRoles } from '../roles/roles.decorator';
import { Controller, Get, Param } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user-decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UserRoles(UserRole.USER)
  findMe(@CurrentUser() user: User) {
    return user;
  }

  @Get()
  @UserRoles(UserRole.ADMIN)
  async findMany() {
    const users = await this.usersService.findMany();
    for (const user of users) delete user['password'];
    return users;
  }

  @Get(':id')
  @UserRoles(UserRole.USER)
  findOne(@Param('id') id: string) {
    const user = this.usersService.findById(id);
    delete user['password'];
    return user;
  }
}
