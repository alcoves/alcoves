import { Test, TestingModule } from '@nestjs/testing';
import { AlcovesController } from './alcoves.controller';
import { AlcovesService } from './alcoves.service';

describe('AlcovesController', () => {
  let controller: AlcovesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlcovesController],
      providers: [AlcovesService],
    }).compile();

    controller = module.get<AlcovesController>(AlcovesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
