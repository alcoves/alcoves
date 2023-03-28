import { SetMetadata } from '@nestjs/common';
import { UserRole, AlcoveRole } from '@prisma/client';

export const USER_ROLES_KEY = 'roles';
export const ALCOVE_ROLES_KEY = 'roles';

export const UserRoles = (...args: UserRole[]) =>
  SetMetadata('userRoles', args);

export const AlcoveRoles = (...args: AlcoveRole[]) =>
  SetMetadata('alcoveRoles', args);
