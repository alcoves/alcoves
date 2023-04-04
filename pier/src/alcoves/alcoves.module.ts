import { Module } from "@nestjs/common";
import { PrismaService } from "../svc/prisma.service";
import { AlcovesService } from "./alcoves.service";
import { AlcovesController } from "./alcoves.controller";

@Module({
  controllers: [AlcovesController],
  providers: [PrismaService, AlcovesService],
})
export class AlcovesModule {}
