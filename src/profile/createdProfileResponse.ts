import { ApiProperty } from '@nestjs/swagger'

export default class CreatedProfile {
  @ApiProperty()
  image: string

  @ApiProperty()
  bio: string

  @ApiProperty()
  userId: number

  @ApiProperty()
  id: number

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  createdAt: Date
}
