import { Body, Controller, Post } from '@nestjs/common'

import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger'
import AuthService from './auth.service'
import AuthDto from './dto/signupAuth.dto'
import UpdateAuthDto from './dto/signinAuth.dto'
import AccessTokenResponse from './accessTokenResponse'

// TODO: Add api tags to the controller in order to group the endpoints
// TODO: Add another failed responses for each methods
@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({
    type: AccessTokenResponse,
  })
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto)
  }

  @Post('signin')
  @ApiResponse({
    type: AccessTokenResponse,
  })
  signin(@Body() dto: UpdateAuthDto) {
    return this.authService.signin(dto)
  }
}
