import { CHECK_ABILITY, RequiredRule } from "./abilities.decorator";
import { AbilityFactory } from "./ability.factory";
import { ForbiddenError } from "@casl/ability";
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class PlatformAbilityGuard implements CanActivate {
	constructor(private reflector: Reflector, private abilityFactory: AbilityFactory) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const allowUnauthorizedRequest = this.reflector.get<boolean>("allowUnauthorizedRequest", context.getHandler());

		if (allowUnauthorizedRequest) {
			return true;
		}

		// The purpose of this guard is to check if the user has the required platform access
		// We assume that the controller has used the @CheckAbilities decorator to specify the required access
		// If the user has the required access, we return true

		const { user } = context.switchToHttp().getRequest();
		if (!user) {
			throw new ForbiddenException("user not found");
		}

		const ability = this.abilityFactory.defineAbilityForPlatformUser(user);
		const rules = this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) || [];

		try {
			rules.forEach((rule) => {
				ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
			});

			return true;
		} catch (error) {
			if (error instanceof ForbiddenError) {
				throw new ForbiddenException(error.message);
			}
		}
	}
}
