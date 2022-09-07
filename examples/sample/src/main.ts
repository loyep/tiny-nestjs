import { core } from 'tiny-nestjs'

const { NestFactory } = core
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(3000)
}

bootstrap()
