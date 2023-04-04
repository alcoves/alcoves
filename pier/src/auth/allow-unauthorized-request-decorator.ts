import { SetMetadata } from "@nestjs/common";

export const AllowUnauthorizedRequest = (...args: string[]) => SetMetadata("allowUnauthorizedRequest", args);
