import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import UserDecorator from 'src/decorators/userDecorators'
import PostDto from './dto/createPost.dto'
import PostService from './post.service'
import UpdatePostDto from './dto/updatePost.dto'
import CreatedPost from './CreatedPostResponse'

@ApiTags('posts')
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
  @ApiForbiddenResponse({
    description: 'You are forbidden to post this post',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: any,
  ) {
    return this.postService.deletePost(id, user.id)
  }

  @Patch(':id')
  @ApiCreatedResponse({
    type: CreatedPost,
  })
  @ApiForbiddenResponse({
    description: 'You are forbidden to update this post',
  })
  @ApiNotFoundResponse({
    description: 'Post not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,

    @UserDecorator() user: any,
  ) {
    const updatedPost = await this.postService.updatePost(id, dto, user.id)
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
