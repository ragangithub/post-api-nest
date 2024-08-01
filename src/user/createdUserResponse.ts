import { ApiProperty } from '@nestjs/swagger'

export default class CreatedUser {
  @ApiProperty()
  email: string

  @ApiProperty()
  password: string

  @ApiProperty()
  fullname: string

  @ApiProperty()
  username: string

  @ApiProperty()
  id: number

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  createdAt: Date
}
