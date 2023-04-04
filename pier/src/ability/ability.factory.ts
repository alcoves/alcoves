import { User, Role } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
} from '@casl/ability';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

// type Actions = 'create' | 'read' | 'update' | 'delete';
// type Subjects = 'Article' | 'Comment' | 'User';

@Injectable()
export class AbilityFactory {
  defineAbilityForPlatformUser(user: User) {
    const { can, build } = new AbilityBuilder(createMongoAbility);

    // Roles are either 'admin' or 'user'
    // Dynamic roles would need to be fetched and evaluated here
    // Casl supports JSON structures which can be stored in the database

    if (user.role === Role.ADMIN) {
      can('manage', 'all');
    } else if (user.role === Role.USER) {
      can('create', 'alcove');
      can('read', 'alcove');
      can('update', 'alcove');
      can('delete', 'alcove');

      can('create', 'user');
      can('read', 'user');
      can('update', 'user');
      // can('delete', 'user');
    } else {
      throw new Error('User has no roles');
    }

    return build();
  }
}
