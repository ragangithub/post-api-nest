import { ApiProperty } from '@nestjs/swagger'

export default class AccessTokenResponse {
  @ApiProperty()
  access_token: string
}
