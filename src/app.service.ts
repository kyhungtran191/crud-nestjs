import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    console.log('AppService.getHello was called')
    return 'Hello World!'
  }
}
