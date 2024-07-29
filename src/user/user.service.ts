import { Injectable, NotFoundException } from '@nestjs/common'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import PrismaService from 'src/prisma/prisma.service'
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export default class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

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

    // return token
    return this.signToken(user.id, user.email)
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

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    }
    const secret = this.config.get('JWT_SECRET')

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    })

    return {
      access_token: token,
    }
  }
}
