import { Test, TestingModule } from '@nestjs/testing';
import { InvitesController } from './invites.controller';
import { InvitesService } from './invites.service';

describe('InvitesController', () => {
  let controller: InvitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvitesController],
      providers: [InvitesService],
    }).compile();

    controller = module.get<InvitesController>(InvitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
