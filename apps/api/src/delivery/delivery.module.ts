import { Module } from '@nestjs/common'
import { DeliveryService } from './delivery.service'
import { DeliveryController } from './delivery.controller'

@Module({
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
