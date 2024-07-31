import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import PostDto from './dto/createPost.dto'
import PostService from './post.service'
import UpdatePostDto from './dto/updatePost.dto'
import CreatedPost from './CreatedPostResponse'

interface MyUserRequest extends Request {
  user?: any
}

@Controller('posts')
@UseGuards(AuthGuard('jwt'))
export default class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreatedPost,
  })
  post(@Body() dto: PostDto) {
    return this.postService.post(dto)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Post deleted successfully.',
  })
  async delete(@Param('id') id: string, @Req() req: MyUserRequest) {
    const postId = parseInt(id, 10)
    return this.postService.deletePost(postId, req.user.sub)
  }

  @Patch(':id')
  @ApiCreatedResponse({
    type: CreatedPost,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() req: MyUserRequest,
  ) {
    const postId = parseInt(id, 10)
    const updatedPost = await this.postService.updatePost(
      postId,
      dto,
      req.user.sub,
    )
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
