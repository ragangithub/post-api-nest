import { ApiProperty } from '@nestjs/swagger'

// TODO change the name file
export default class CreatedPost {
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
