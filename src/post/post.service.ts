import { Injectable, NotFoundException } from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import PostDto from './dto/createPost.dto'
import UpdatePostDto from './dto/updatePost.dto'

@Injectable()
export default class PostService {
  constructor(private prisma: PrismaService) {}

  async post(dto: PostDto) {
    const newPost = await this.prisma.post.create({
      data: {
        text: dto.text,
        title: dto.title,

        author: {
          connect: { id: Number(dto.authorId) },
        },
      },
    })

    return newPost
  }

  async getAllPosts() {
    const allPosts = await this.prisma.post.findMany({
      include: {
        author: true,
      },
    })
    console.log('hi')
    return allPosts
  }

  async deletePost(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    await this.prisma.post.delete({
      where: { id: postId },
    })

    return { message: 'Post deleted successfully' }
  }

  async updatePost(postId: number, dto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new NotFoundException('post not found')
    }

    interface UpdateData {
      title?: string
      text?: string
    }

    const updateData: UpdateData = {}

    if (dto.title) {
      updateData.title = dto.title
    }
    if (dto.text) {
      updateData.text = dto.text
    }

    return this.prisma.post.update({
      where: { id: postId },
      data: updateData,
    })
  }
}
