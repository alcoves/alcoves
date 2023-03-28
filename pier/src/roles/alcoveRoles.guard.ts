import { AlcoveRole, Membership } from '@prisma/client';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma.service';
import { ALCOVE_ROLES_KEY } from './roles.decorator';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AlcoveRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<AlcoveRole[]>(
      ALCOVE_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { params, user } = context.switchToHttp().getRequest();

    const alcoveMembership = await this.prismaService.membership.findMany({
      where: {
        userId: user.id,
        alcoveId: params?.alcoveId,
      },
    });

    if (!alcoveMembership.length) {
      return false;
    }

    return requiredRoles.some((role) =>
      alcoveMembership[0].roles?.includes(role),
    );
  }
}
