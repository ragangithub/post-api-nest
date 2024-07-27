import { IsNotEmpty, IsString } from 'class-validator'

export default class ProfileDto {
  @IsString()
  image: string

  @IsString()
  location: string

  @IsString()
  bio: string

  @IsNotEmpty()
  @IsString()
  userId: string
}
