import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import UserDecorator from 'src/decorators/userDecorators'
import ProfileService from './profile.service'
import ProfileDto from './dto/createProfile.dto'
import UpdateProfileDto from './dto/updateProfile.dto'
import CreatedProfile from './createdProfileResponse'

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(AuthGuard('jwt'))
export default class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreatedProfile,
  })
  post(@Body() dto: ProfileDto, @UserDecorator() user: any) {
    return this.profileService.post(dto, user.id)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Profile deleted successfully.',
  })
  @ApiForbiddenResponse({
    description: 'You are forbidden to delete this profile',
  })
  @ApiNotFoundResponse({
    description: 'Profile not found',
  })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @UserDecorator() user: any,
  ) {
    return this.profileService.deleteProfile(id, user.id)
  }

  @Patch(':id')
  @ApiCreatedResponse({
    type: CreatedProfile,
  })
  @ApiForbiddenResponse({
    description: 'You are forbidden to update this profile',
  })
  @ApiNotFoundResponse({
    description: 'Profile not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProfileDto,
    @UserDecorator() user: any,
  ) {
    const updatedProfile = await this.profileService.updateProfile(
      id,
      dto,
      user.id,
    )
    return updatedProfile
  }
}
