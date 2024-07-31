import { Injectable, UnauthorizedException } from '@nestjs/common'

import PrismaService from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import UpdateAuthDto from './dto/signinAuth.dto'

@Injectable()
export default class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signin(dto: UpdateAuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      })

      if (!user) throw new UnauthorizedException('Credentials incorrect')

      // compare password
      const pwMatches = await argon.verify(user.password, dto.password)
      // if password incorrect throw exception
      if (!pwMatches) throw new UnauthorizedException('Credentials incorrect')
      return await this.signToken(user.id, user.email)
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error
      } else {
        throw new Error('An error occurred while signing')
      }
    }
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
