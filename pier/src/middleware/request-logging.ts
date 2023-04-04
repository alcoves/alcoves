import * as morgan from "morgan";
import { Logger } from "@nestjs/common";

export function useRequestLogging(app) {
	const logger = new Logger("Request");
	app.use(
		morgan("tiny", {
			stream: {
				write: (message) => logger.log(message.replace("\n", "")),
			},
		}),
	);
}
