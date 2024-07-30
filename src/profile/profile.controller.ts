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
import ProfileService from './profile.service'
import ProfileDto from './dto/createProfile.dto'
import UpdateProfileDto from './dto/updateProfile.dto'

interface MyUserRequest extends Request {
  user?: any
}

@Controller('profile')
@UseGuards(AuthGuard('jwt'))
export default class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  post(@Body() dto: ProfileDto) {
    return this.profileService.post(dto)
  }

  @Delete(':id')
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
