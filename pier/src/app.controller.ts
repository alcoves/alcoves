import { Get, Controller } from "@nestjs/common";
import { AllowUnauthorizedRequest } from "./auth/allow-unauthorized-request-decorator";

@Controller()
export class AppController {
	@Get()
  @AllowUnauthorizedRequest()
	root(): string {
		return "OK";
	}
}
