import { PartialType } from '@nestjs/mapped-types'
import ProfileDto from './createProfile.dto'

export default class UpdateProfileDto extends PartialType(ProfileDto) {}
