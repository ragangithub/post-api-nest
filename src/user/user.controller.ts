import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import AuthDto from 'src/auth/dto/signupAuth.dto'
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import UserDecorator from 'src/decorators/userDecorators'
import { AuthGuard } from '@nestjs/passport'
import UserService from './user.service'
import UpdateUserDto from './dto/updateUser.dto'
import CreatedUser from './createdUserResponse'

@ApiTags('users')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export default class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @ApiOkResponse({
    type: CreatedUser,
  })
  signup(@Body() dto: AuthDto) {
    return this.userService.createUser(dto)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'User deleted successfully.',
  })
  @ApiForbiddenResponse({
    description: 'You are forbidden to delete this user',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: any,
  ) {
    return this.userService.deleteUser(id, user.id)
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
  @ApiForbiddenResponse({
    description: 'You are forbidden to update this user',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @UserDecorator() user: any,
  ) {
    const updatedPost = await this.userService.updateUser(id, dto, user.id)
    return updatedPost
  }
}
