import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //auto loại bỏ các field ko khai bao DTO
      forbidNonWhitelisted: true, //Field ko khai bao trong DTO se bao loi
      transform: true, //Tu dong chuyen doi du lieu sang kieu duoc khai bao trong DTO,
      transformOptions: {
        enableImplicitConversion: true, //chuyen du lieu ngam dinh tuong ung voi DTO
      },
      exceptionFactory: (errors: ValidationError[]) =>
        new UnprocessableEntityException(
          errors.map((err) => ({
            field: err.property,
            error: Object.values(err.constraints).join(','),
          })),
        ),
    }),
  )
  await app.listen(3000)
}
bootstrap()
