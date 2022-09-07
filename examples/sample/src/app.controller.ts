import { Controller, Get } from 'tiny-nestjs'
import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  @Get('/error')
  getError() {
    throw new Error('Source map test')
  }
}
