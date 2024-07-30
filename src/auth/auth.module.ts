import { Module } from '@nestjs/common'
import UserModule from 'src/user/user.module'
import { JwtModule } from '@nestjs/jwt'
import AuthService from './auth.service'
import AuthController from './auth.controller'
import JwtStrategy from '../strategy/jwt.strategy'

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export default class AuthModule {}
