import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import PostDto from './dto/createPost.dto'
import PostService from './post.service'
import UpdatePostDto from './dto/updatePost.dto'

@Controller('post')
export default class PostController {
  constructor(private postService: PostService) {}

  @Post()
  post(@Body() dto: PostDto) {
    return this.postService.post(dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const postId = parseInt(id, 10)
    return this.postService.deletePost(postId)
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const postId = parseInt(id, 10)
    const updatedPost = await this.postService.updatePost(postId, dto)
    return updatedPost
  }

  @Get()
  async getAllPosts() {
    const allPosts = await this.postService.getAllPosts()
    return allPosts
  }
}
