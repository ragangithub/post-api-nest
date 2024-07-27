import { Body, Controller, Post } from '@nestjs/common'
import UserService from 'src/user/user.service'
import AuthService from './auth.service'
import AuthDto from './dto/signupAuth.dto'
import UpdateAuthDto from './dto/signinAuth.dto'

@Controller('auth')
export default class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.userService.signup(dto)
  }

  @Post('signin')
  signin(@Body() dto: UpdateAuthDto) {
    return this.authService.signin(dto)
  }
}
