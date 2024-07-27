import { IsNotEmpty, IsString } from 'class-validator'

export default class PostDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  text: string

  @IsNotEmpty()
  @IsString()
  authorId: string
}
