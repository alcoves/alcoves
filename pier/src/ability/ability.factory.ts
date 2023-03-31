import { User, UserRole } from '@prisma/client';
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

    const isUser = user.roles.find((r) => r === UserRole.USER);
    const isAdmin = user.roles.find((r) => r === UserRole.ADMIN);

    if (isAdmin) {
      can('manage', 'all');
    } else if (isUser) {
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

    // We need to go get the users membership if the requested resource is to an alcove
    // This may warrant a separate factory

    // if (user) can(Action.Manage, 'all');
    // can(Action.Manage, 'all', { createdBy: user.id });
    // can('create', Post);
    // can('update', Post, { createdBy: user.id });
    // can('delete', Post, { createdBy: user.id });
    // can('update', User, { id: user.id });
    // can('delete', User, { id: user.id });

    // return build({
    //   detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    // });

    return build();
  }
}
