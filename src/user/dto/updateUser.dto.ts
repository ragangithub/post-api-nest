// import { PartialType } from '@nestjs/mapped-types'

import { PartialType } from '@nestjs/swagger'

import AuthDto from 'src/auth/dto/signupAuth.dto'

export default class UpdateUserDto extends PartialType(AuthDto) {}
