import { Global, Module } from '@nestjs/common'
import UserModule from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import AuthService from './auth.service'
import AuthController from './auth.controller'

@Global()
@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
})
export default class AuthModule {}
