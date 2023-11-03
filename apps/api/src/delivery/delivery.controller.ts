import { ApiTags } from '@nestjs/swagger'
import { DeliveryService } from './delivery.service'
import { Controller, Get, Param } from '@nestjs/common'

@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get(':assetId')
  findOne(@Param('assetId') assetId: string) {
    return this.deliveryService.findOne(assetId)
  }
}
