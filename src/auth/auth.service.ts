import { Injectable } from '@nestjs/common'
// import { User, Profile } from '@prisma/client'
import PrismaService from 'src/prisma/prisma.service'

import UpdateAuthDto from './dto/signinAuth.dto'

@Injectable()
export default class AuthService {
  constructor(private prisma: PrismaService) {}

  async signin(dto: UpdateAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    })
    return user
  }
}
