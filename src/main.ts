import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConsoleLogger } from '@nestjs/common'

async function bootstrap() {
  const app = await await NestFactory.create(AppModule, {
    logger: new ConsoleLogger(), // Ensures ConsoleLogger is used
  })
  await app.listen(3000)
  console.log(123)
}
bootstrap()
