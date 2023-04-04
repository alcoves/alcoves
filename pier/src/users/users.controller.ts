import { Prisma, User } from "@prisma/client";
import { UsersService } from "./users.service";
import { Get, Param, Patch, Delete, Controller, ForbiddenException, Body, HttpCode } from "@nestjs/common";
import { CurrentUser } from "../auth/current-user-decorator";
import { CheckAbilities } from "../ability/abilities.decorator";
import { AbilityFactory } from "../ability/ability.factory";

@Controller('users')
export class UsersController {
	constructor(private abilityFactory: AbilityFactory, private readonly usersService: UsersService) {}

	@Get('me')
  @CheckAbilities({ action: 'read', subject: 'user' })
	findMe(@CurrentUser() user: User) {
		return user;
	}

	@Get()
  @CheckAbilities({ action: 'manage', subject: 'user' })
	async findMany() {
		const users = await this.usersService.findMany();
		for (const user of users) delete user["password"];
		return { users };
	}

	@Get(':id')
  @CheckAbilities({ action: 'read', subject: 'user' })
	findOne(@Param('id') id: string) {
		const user = this.usersService.findById(id);
		delete user["password"];
		return user;
	}

	@Patch(':id')
  @CheckAbilities({ action: 'update', subject: 'user' })
	async updateOne(
		@Param('id') id: string,
		@Body() data: Prisma.UserUpdateInput,
	) {
		const user = await this.usersService.updateOne(id, data);
		delete user["password"];
		return user;
	}

	@Delete(':id')
  @HttpCode(204)
  @CheckAbilities({ action: 'delete', subject: 'user' })
	async remove(@Param('id') id: string) {
		await this.usersService.remove(id);
	}
}
