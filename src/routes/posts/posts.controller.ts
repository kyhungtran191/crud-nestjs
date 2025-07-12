import { Controller, Get, UseGuards } from '@nestjs/common'
import { PostsService } from './posts.service'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.const'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Auth([AuthType.APIKey, AuthType.Bearer], {
    condition: ConditionGuard.OR,
  })
  // @UseGuards(AuthenticationGuard)
  @Get()
  getPost() {
    return '12312'
  }
}
