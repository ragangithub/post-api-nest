import { createParamDecorator, ExecutionContext } from '@nestjs/common'

const UserDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)

export default UserDecorator
