import { Injectable } from 'tiny-nestjs'

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!'
  }
}
