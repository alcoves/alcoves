import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { PrismaService } from "../svc/prisma.service";
import { AbilityModule } from "../ability/ability.module";

@Module({
  imports: [AbilityModule],
  controllers: [UsersController],
  providers: [PrismaService, UsersService],
})
export class UsersModule {}
