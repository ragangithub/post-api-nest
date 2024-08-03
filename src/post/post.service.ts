import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import PrismaService from 'src/prisma/prisma.service'
import PostDto from './dto/createPost.dto'
import UpdatePostDto from './dto/updatePost.dto'

@Injectable()
export default class PostService {
  constructor(private prisma: PrismaService) {}

  // TODO: It's better to use the user id form authenticated user, access the information by implementing decorator to access the user information
  // TODO: Use try catch block to handle the error

  async post(dto: PostDto, user: any) {
    const newPost = await this.prisma.post.create({
      data: {
        text: dto.text,
        title: dto.title,

        author: {
          connect: { id: Number(user.id) },
        },
      },
    })

    return newPost
  }

  async getAllPosts() {
    try {
      const allPosts = await this.prisma.post.findMany({
        // include: {
        //   author: true,
        // },
      })

      // TODO: I don't think this is necessary
      if (allPosts.length === 0) {
        throw new NotFoundException('No posts found')
      }

      return allPosts
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new Error('An error occurred while fetching posts')
      }
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

      // TODO: Implement soft delete by adding deleteAt column in the post table and update the value to current date
      await this.prisma.post.delete({
        where: { id: postId },
      })

      return { message: 'Post deleted successfully' }
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
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

      // TODO: The http exceptioon should be forbidden instead of unauthorized
      if (post.author.id !== incomingId) {
        throw new UnauthorizedException(
          'You are not authorized to delete this post',
        )
      }

      // TODO: this is not the right place to define interface
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

      return await this.prisma.post.update({
        where: { id: postId },
        data: updateData,
      })
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error
      } else {
        throw new Error('An error occurred while updating the post')
      }
    }
  }
}
