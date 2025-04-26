import { Injectable, UnauthorizedException } from '@nestjs/common'

import PrismaService from 'src/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import UserService from 'src/user/user.service'
import UpdateAuthDto from './dto/signinAuth.dto'
import AuthDto from './dto/signupAuth.dto'

@Injectable()
export default class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private userService: UserService,
  ) {}

  async signup(dto: AuthDto) {
    const user: any = await this.userService.createUser(dto)

    const token: object = await this.signToken(user.id, user.email)

    return { user, token }
  }

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
      delete user.password
      const token = await this.signToken(user.id, user.email)
      return { user, token }
      // return this.signToken(user.id, user.email)
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
      expiresIn: this.config.get('EXP_TIME'),
      secret,
    })

    return {
      access_token: token,
    }
  }
}
