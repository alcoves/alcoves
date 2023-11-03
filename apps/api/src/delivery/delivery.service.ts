import { Injectable } from '@nestjs/common'

@Injectable()
export class DeliveryService {
  findOne(id: string) {
    return `This action returns a #${id} delivery`
  }
}
