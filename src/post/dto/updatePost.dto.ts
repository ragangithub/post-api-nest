import { PartialType } from '@nestjs/mapped-types'
import PostDto from './createPost.dto'

export default class UpdatePostDto extends PartialType(PostDto) {}
