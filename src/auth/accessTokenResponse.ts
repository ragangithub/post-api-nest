import { ApiProperty } from '@nestjs/swagger'

// TODO: Add example value for the access_token
// TODO: Itwould be better if you define the file in responses folder
export default class AccessTokenResponse {
  @ApiProperty()
  access_token: string
}
