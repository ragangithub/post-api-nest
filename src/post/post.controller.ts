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
import PostDto from './dto/createPost.dto'
import PostService from './post.service'
import UpdatePostDto from './dto/updatePost.dto'

interface MyUserRequest extends Request {
  user?: any
}

@Controller('post')
@UseGuards(AuthGuard('jwt'))
export default class PostController {
  constructor(private postService: PostService) {}

  @Post()
  post(@Body() dto: PostDto) {
    return this.postService.post(dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: MyUserRequest) {
    const postId = parseInt(id, 10)
    return this.postService.deletePost(postId, req.user.sub)
  }

  @Patch(':id')
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
  async getAllPosts() {
    const allPosts = await this.postService.getAllPosts()
    return allPosts
  }
}
