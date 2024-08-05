import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import PostDto from './dto/createPost.dto'
import UpdatePostDto from './dto/updatePost.dto'
import PostUpdateType from './types/post'

@Injectable()
export default class PostService {
  constructor(private prisma: PrismaService) {}

  async post(dto: PostDto, incomingId: number) {
    const newPost = await this.prisma.post.create({
      data: {
        text: dto.text,
        title: dto.title,

        author: {
          connect: { id: Number(incomingId) },
        },
      },
    })

    return newPost
  }

  async getAllPosts() {
    try {
      const allPosts = await this.prisma.post.findMany({})

      return allPosts
    } catch (error) {
      throw new Error('An error occurred while fetching posts')
    }
  }

  async deletePost(postId: number, incomingId: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
        },
      })

      if (!post) {
        throw new NotFoundException('Post not found')
      }

      if (post.author.id !== incomingId) {
        throw new ForbiddenException('You are forbidden to delete this post')
      }

      await this.prisma.post.delete({
        where: { id: postId },
      })

      return { message: 'Post deleted successfully' }
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error
      } else {
        throw new Error('An error occurred while deleting the post')
      }
    }
  }

  async updatePost(postId: number, dto: UpdatePostDto, incomingId: number) {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: true,
        },
      })

      if (!post) {
        throw new NotFoundException('post not found')
      }

      if (post.author.id !== incomingId) {
        throw new ForbiddenException('You are forbidden to update this post')
      }

      const updateData: PostUpdateType = {}

      if (dto.title) {
        updateData.title = dto.title
      }
      if (dto.text) {
        updateData.text = dto.text
      }

      return await this.prisma.post.update({
        where: { id: postId },
        data: updateData,
      })
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error
      } else {
        throw new Error('An error occurred while updating the post')
      }
    }
  }
}
