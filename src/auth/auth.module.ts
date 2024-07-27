import { Global, Module } from '@nestjs/common'
import UserModule from 'src/user/user.module'
import AuthService from './auth.service'
import AuthController from './auth.controller'

@Global()
@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export default class AuthModule {}
