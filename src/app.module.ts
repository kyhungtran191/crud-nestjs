import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsController } from './routes/posts/posts.controller'
import { SharedModule } from './shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { PostsModule } from './routes/posts/posts.module'

@Module({
  imports: [PostsModule, SharedModule, AuthModule],
  controllers: [AppController],

  providers: [
    AppService,
    // Config global serialize
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
