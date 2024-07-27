import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common'
import ProfileService from './profile.service'
import ProfileDto from './dto/createProfile.dto'
import UpdateProfileDto from './dto/updateProfile.dto'

@Controller('profile')
export default class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Post()
  post(@Body() dto: ProfileDto) {
    return this.profileService.post(dto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const profileId = parseInt(id, 10)
    return this.profileService.deleteProfile(profileId)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    const profileId = parseInt(id, 10)
    const updatedProfile = await this.profileService.updateProfile(
      profileId,
      dto,
    )
    return updatedProfile
  }
}
