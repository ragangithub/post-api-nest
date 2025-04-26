import { Body, Controller, Post } from '@nestjs/common'

import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import CreatedUser from 'src/user/createdUserResponse'
import AuthService from './auth.service'
import AuthDto from './dto/signupAuth.dto'
import UpdateAuthDto from './dto/signinAuth.dto'

import AccessTokenResponse from './accessTokenResponse'

@ApiTags('auth')
@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiExtraModels(AccessTokenResponse)
  @ApiResponse({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: { $ref: getSchemaPath(CreatedUser) },
            access_token: { $ref: getSchemaPath(AccessTokenResponse) },
          },
        },
      },
    },
  })
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto)
  }

  @Post('signin')
  @ApiResponse({
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            user: { $ref: getSchemaPath(CreatedUser) },
            access_token: { $ref: getSchemaPath(AccessTokenResponse) },
          },
        },
      },
    },
  })
  signin(@Body() dto: UpdateAuthDto) {
    return this.authService.signin(dto)
  }
}
