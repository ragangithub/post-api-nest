import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import UserDecorator from 'src/decorators/userDecorators'
import PostDto from './dto/createPost.dto'
import PostService from './post.service'
import UpdatePostDto from './dto/updatePost.dto'
import CreatedPost from './CreatedPostResponse'

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export default class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreatedPost,
  })
  post(@Body() dto: PostDto, @UserDecorator() user: any) {
    return this.postService.post(dto, user.id)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Post deleted successfully.',
  })
  async delete(@Param('id') id: string, @UserDecorator() user: any) {
    const postId = parseInt(id, 10)
    return this.postService.deletePost(postId, user.id)
  }

  @Patch(':id')
  @ApiCreatedResponse({
    type: CreatedPost,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,

    @UserDecorator() user: any,
  ) {
    const postId = parseInt(id, 10)
    const updatedPost = await this.postService.updatePost(postId, dto, user.id)
    return updatedPost
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedPost],
  })
  async getAllPosts() {
    const allPosts = await this.postService.getAllPosts()
    return allPosts
  }
}
