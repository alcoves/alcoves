import { Alcove } from "@prisma/client";
import { AlcovesService } from "./alcoves.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AlcovesController } from "./alcoves.controller";

describe("AlcovesController", () => {
	let controller: AlcovesController;

	const mockAlcovesService = {
		create: jest.fn(async (alcove: Alcove) => alcove),
		findAll: jest.fn(async () => [
			{
				id: "123",
			},
			{
				id: "456",
			},
		]),
		findOne: jest.fn(async (id: string) => {
			return {
				id,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		}),
		update: jest.fn(async (id: string, update) => {
			return { id, ...update };
		}),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AlcovesController],
			providers: [AlcovesService],
		})
			.overrideProvider(AlcovesService)
			.useValue(mockAlcovesService)
			.compile();

		controller = module.get<AlcovesController>(AlcovesController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should list alcoves", async () => {
		const alcoves = [
			{
				id: "123",
			},
			{
				id: "456",
			},
		];

		expect(await controller.findAll()).toEqual({
			alcoves,
		});
	});

	it("should list an alcove", async () => {
		const alcoveId = "123";
		expect(await controller.findOne(alcoveId)).toHaveProperty("alcove.id", alcoveId);
	});

	// it('should update an alcove', async () => {
	//   const updateInput = { name: 'Test' };
	//   expect(
	//     await controller.update('123', {
	//       ...updateInput,
	//     }),
	//   ).toEqual({
	//     id: '123',
	//     ...updateInput,
	//   });
	// });

	it("should create an alcove", async () => {
		const newAlcove = {
			id: "456",
			name: "New Alcove",
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		expect(await controller.create(newAlcove)).toEqual(newAlcove);
	});
});
