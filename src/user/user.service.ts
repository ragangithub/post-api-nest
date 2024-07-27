import { Injectable, NotFoundException } from '@nestjs/common'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import PrismaService from 'src/prisma/prisma.service'
import * as argon from 'argon2'

@Injectable()
export default class UserService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hash,
        username: dto.username,
        fullname: dto.fullname,
      },
    })

    return user
  }

  async deleteUser(userId: number) {
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

    // if the user has a profile
    if (user.profile) {
      await this.prisma.profile.delete({
        where: {
          id: user.profile.id,
        },
      })
    }

    // if the user has any posts
    if (user.posts.length > 0) {
      Promise.all(
        user.posts.map(async (post) => {
          await this.prisma.post.delete({
            where: { id: post.id },
          })
        }),
      )
    }

    await this.prisma.user.delete({
      where: { id: userId },
    })

    return { message: 'user deleted successfully' }
  }
}
