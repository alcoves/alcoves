import { Injectable } from "@nestjs/common";

@Injectable()
export class StreamsService {
	streamOne() {
		return "This action returns all streams";
	}
}
