import { Injectable } from '@nestjs/common'

@Injectable()
export class StorageService {
  getObject(name: string = 'World'): string {
    return `Hello, ${name}!`
  }
}
