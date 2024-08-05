import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import UserDecorator from 'src/decorators/userDecorators'
import ProfileService from './profile.service'
import ProfileDto from './dto/createProfile.dto'
import UpdateProfileDto from './dto/updateProfile.dto'
import CreatedProfile from './createdProfileResponse'

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
  async delete(@Param('id') id: string, @UserDecorator() user: any) {
    const profileId = parseInt(id, 10)
    return this.profileService.deleteProfile(profileId, user.id)
  }

  @Patch(':id')
  @ApiCreatedResponse({
    type: CreatedProfile,
  })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @UserDecorator() user: any,
  ) {
    const profileId = parseInt(id, 10)
    const updatedProfile = await this.profileService.updateProfile(
      profileId,
      dto,
      user.id,
    )
    return updatedProfile
  }
}
