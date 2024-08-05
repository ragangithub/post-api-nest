import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import AccessTokenResponseDto from 'src/auth/accessTokenResponse'

import UserDecorator from 'src/decorators/userDecorators'
import UserService from './user.service'
import UpdateUserDto from './dto/updateUser.dto'
import CreatedUser from './createdUserResponse'

@Controller('users')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @ApiCreatedResponse({
    type: AccessTokenResponseDto,
  })
  signup(@Body() dto: AuthDto) {
    return this.userService.createUser(dto)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  async delete(@Param('id') id: string, @UserDecorator() user: any) {
    const userId = parseInt(id, 10)
    return this.userService.deleteUser(userId, user.sub)
  }

  @Get()
  @ApiOkResponse({
    type: [CreatedUser],
  })
  async getAllPosts() {
    const allUsers = await this.userService.getAllUsers()
    return allUsers
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UserDecorator() user: any,
  ) {
    const userId = parseInt(id, 10)
    const updatedPost = await this.userService.updateUser(userId, dto, user.sub)
    return updatedPost
  }
}
