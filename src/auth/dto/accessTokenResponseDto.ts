import { ApiProperty } from '@nestjs/swagger'

export default class AccessTokenResponseDto {
  @ApiProperty()
  access_token: string
}
