import { Injectable } from '@nestjs/common'
// import { User, Profile } from '@prisma/client'
import PrismaService from 'src/prisma/prisma.service'

@Injectable()
export default class AuthService {
  constructor(private prisma: PrismaService) {}

  signup() {
    return { msg: 'signed up' }
  }

  signin() {
    return { msg: 'signed in' }
  }
}
