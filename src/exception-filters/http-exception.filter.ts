import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'

@Catch(HttpException)
export default class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()

    console.log('exceptionResponse', exceptionResponse)

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exceptionResponse.message,
      error: exceptionResponse.error,
    })
  }
}
