import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PostsController } from './routes/posts/posts.controller'
import { PostsModule } from './routes/posts/posts.module'
import { SharedModule } from './shared/shared.module'

@Module({
  imports: [PostsModule, SharedModule],
  controllers: [AppController, PostsController],
  providers: [AppService],
})
export class AppModule {}
