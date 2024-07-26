import { Injectable } from '@nestjs/common'

@Injectable()
export default class AuthService {
  signup() {
    return { msg: 'signed up' }
  }

  signin() {
    return { msg: 'signed in' }
  }
}
