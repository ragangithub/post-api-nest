// import { PartialType } from '@nestjs/mapped-types'
import { OmitType, PartialType } from '@nestjs/swagger'

import AuthDto from './signupAuth.dto'

// export default class UpdateAuthDto extends PartialType(AuthDto) {}

export default class UpdateAuthDto extends PartialType(
  OmitType(AuthDto, ['fullname', 'username'] as const),
) {}
