
import { User } from "@prisma/client";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => {
      const user: User = context.switchToHttp().getRequest().user;
      return user
    }
)