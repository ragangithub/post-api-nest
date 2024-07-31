import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import AccessTokenResponseDto from 'src/auth/accessTokenResponse'
import UserService from './user.service'

@Controller('users')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @ApiCreatedResponse({
    type: AccessTokenResponseDto,
  })
  signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.userService.signup(dto)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  async delete(@Param('id') id: string) {
    const userId = parseInt(id, 10)
    return this.userService.deleteUser(userId)
  }
}
