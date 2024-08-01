import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import AccessTokenResponseDto from 'src/auth/accessTokenResponse'
import AuthService from 'src/auth/auth.service'
import UserService from './user.service'
import UpdateUserDto from './dto/updateUser.dto'

interface MyUserRequest extends Request {
  user?: any
}

@Controller('users')
export default class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('')
  @ApiCreatedResponse({
    type: AccessTokenResponseDto,
  })
  signup(@Body() dto: AuthDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  async delete(@Param('id') id: string, @Req() req: MyUserRequest) {
    const userId = parseInt(id, 10)
    return this.userService.deleteUser(userId, req.user.sub)
  }

  @Get()
  async getAllPosts() {
    const allUsers = await this.userService.getAllUsers()
    return allUsers
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @Req() req: MyUserRequest,
  ) {
    const userId = parseInt(id, 10)
    const updatedPost = await this.userService.updateUser(
      userId,
      dto,
      req.user.sub,
    )
    return updatedPost
  }
}
