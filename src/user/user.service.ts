import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'

import PrismaService from 'src/prisma/prisma.service'

import * as argon from 'argon2'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import UpdateUserDto from './dto/updateUser.dto'
import UserUpdateType from './types/user'

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: AuthDto) {
    try {
      const hash = await argon.hash(dto.password)

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          username: dto.username,
          fullname: dto.fullname,
        },
      })

      delete user.password

      return user
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException('Credentials taken')
      } else {
        throw new Error('An error occurred while creating a user')
      }
    }
  }

  async deleteUser(userId: number, incomingId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: true,
          posts: true,
        },
      })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      if (user.id !== incomingId) {
        throw new ForbiddenException('You are forbidden to delete this user')
      }

      // if the user has a profile
      if (user.profile) {
        await this.prisma.profile.update({
          where: {
            id: user.profile.id,
          },
          data: {
            deletedAt: new Date(),
          } as any,
        })
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          deletedAt: new Date(),
        } as any,
      })

      // if the user has a post
      if (user.posts.length > 0) {
        await Promise.all(
          user.posts.map(async (post) => {
            await this.prisma.post.update({
              where: { id: post.id },
              data: {
                deletedAt: new Date(),
              } as any,
            })
          }),
        )
      }

      return { message: 'user deleted successfully' }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new Error('An error occurred while deleting the user')
      }
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await this.prisma.user.findMany({
        where: {
          deletedAt: null,
        } as any,
        select: {
          id: true,
          email: true,
          fullname: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      return allUsers
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      } else {
        throw new Error('An error occurred while fetching users')
      }
    }
  }

  async updateUser(userId: number, dto: UpdateUserDto, incomingId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new NotFoundException('user not found')
      }

      if (user.id !== incomingId) {
        throw new ForbiddenException('You are forbidden to update this user')
      }

      const updateData: UserUpdateType = {}

      if (dto.email) {
        updateData.email = dto.email
      }
      if (dto.username) {
        updateData.username = dto.username
      }
      if (dto.fullname) {
        updateData.fullname = dto.fullname
      }

      return await this.prisma.user.update({
        where: { id: userId },
        data: updateData,
      })
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error
      } else {
        throw new Error('An error occurred while updating the user')
      }
    }
  }
}
