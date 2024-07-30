import { ApiProperty } from '@nestjs/swagger'

export default class CreatedPostDto {
  @ApiProperty()
  title: string

  @ApiProperty()
  text: string

  @ApiProperty()
  authorId: number

  @ApiProperty()
  id: number

  @ApiProperty()
  updatedAt: Date

  @ApiProperty()
  createdAt: Date
}