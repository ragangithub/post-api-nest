import { Controller, Post } from '@nestjs/common'

@Controller('auth')
export default class AuthController {
  @Post('signup')
  signup() {
    return 'hi'
  }

  @Post('signin')
  signin() {
    return 'hi'
  }
}
