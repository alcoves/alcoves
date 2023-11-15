import { AssetsService } from './assets.service'
import { Test, TestingModule } from '@nestjs/testing'

describe('AssetsService', () => {
  let service: AssetsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssetsService],
    }).compile()

    service = module.get<AssetsService>(AssetsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
