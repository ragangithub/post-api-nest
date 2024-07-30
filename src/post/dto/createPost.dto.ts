import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export default class PostDto {
  @ApiProperty({
    description: 'The title of post',
    example: 'post1',
  })
  @IsNotEmpty()
  @IsString()
  title: string

  @ApiProperty({
    description: 'Description of post',
    example: 'My first post',
  })
  @IsNotEmpty()
  @IsString()
  text: string

  @ApiProperty({
    description: 'id of the owner of post',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  authorId: string
}
