import * as fs from "fs-extra";
import { Request, Response } from "express";
import { StreamsService } from "./streams.service";
import { Controller, Get, Param, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Controller('streams')
export class StreamsController {
	constructor(
		private configService: ConfigService,
		private readonly streamsService: StreamsService,
	) {}

	@Get('/*')
	async streamOne(
		@Param() params: any,
		@Res() res: Response,
		@Req() req: Request,
	) {
		const path = params[0];
		const dataDir = this.configService.get("DATA_DIR");
		const fullAssetPath = path ? `${dataDir}/${path}` : dataDir;

		const stat = fs.statSync(fullAssetPath);
		const fileSize = stat.size;
		const range = req.headers.range;

		if (range) {
			const parts = range.replace(/bytes=/, "").split("-");
			const start = parseInt(parts[0], 10);
			const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
			const chunksize = end - start + 1;
			const file = fs.createReadStream(fullAssetPath, {
				start,
				end,
			});
			const head = {
				"Content-Range": `bytes ${start}-${end}/${fileSize}`,
				"Accept-Ranges": "bytes",
				"Content-Length": chunksize,
				"Content-Type": "video/mp4",
			};
			res.writeHead(206, head);
			return file.pipe(res);
		} else {
			const head = {
				"Content-Length": fileSize,
				"Content-Type": "video/mp4",
			};
			res.writeHead(200, head);
			return fs.createReadStream(fullAssetPath).pipe(res);
		}
	}
}
