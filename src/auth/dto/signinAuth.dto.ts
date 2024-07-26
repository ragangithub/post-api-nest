import { PartialType } from '@nestjs/mapped-types'
import AuthDto from './signupAuth.dto'

export default class UpdateAuthDto extends PartialType(AuthDto) {}
