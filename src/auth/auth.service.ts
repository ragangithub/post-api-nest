import { Injectable } from '@nestjs/common'
// import { User, Profile } from '@prisma/client'
import PrismaService from 'src/prisma/prisma.service'
import * as argon from 'argon2'
import AuthDto from './dto/signupAuth.dto'
import UpdateAuthDto from './dto/signinAuth.dto'

@Injectable()
export default class AuthService {
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

  async signin(dto: UpdateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    return user
  }
}
