import { Test, TestingModule } from "@nestjs/testing";
import { AlcovesService } from "./alcoves.service";

describe("AlcovesService", () => {
	let service: AlcovesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AlcovesService],
		}).compile();

		service = module.get<AlcovesService>(AlcovesService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
