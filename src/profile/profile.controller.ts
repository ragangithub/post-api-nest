import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import ProfileService from './profile.service'
import ProfileDto from './dto/createProfile.dto'
import UpdateProfileDto from './dto/updateProfile.dto'
import CreatedProfiletDto from './dto/createdProfile.dto'

interface MyUserRequest extends Request {
  user?: any
}

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export default class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  @ApiCreatedResponse({
    type: CreatedProfiletDto,
  })
  post(@Body() dto: ProfileDto) {
    return this.profileService.post(dto)
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Profile deleted successfully.',
  })
  async delete(@Param('id') id: string, @Req() req: MyUserRequest) {
    const profileId = parseInt(id, 10)
    return this.profileService.deleteProfile(profileId, req.user.sub)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @Req() req: MyUserRequest,
  ) {
    const profileId = parseInt(id, 10)
    const updatedProfile = await this.profileService.updateProfile(
      profileId,
      dto,
      req.user.sub,
    )
    return updatedProfile
  }
}
