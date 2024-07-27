import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import UserService from './user.service'

@Controller('user')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  signup(@Body() dto: AuthDto) {
    return this.userService.signup(dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const userId = parseInt(id, 10)
    return this.userService.deleteUser(userId)
  }
}
