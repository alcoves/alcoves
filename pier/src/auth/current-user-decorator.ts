import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { User } from "@prisma/client";

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) => {
	const user: User = context.switchToHttp().getRequest().user;
	delete user["password"];
	return user;
});
