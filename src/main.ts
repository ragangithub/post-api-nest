import { NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import { ConfigService } from '@nestjs/config'
import winstonLoggerInstance from './utils/logger/winston.logger'
import AppModule from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance: winstonLoggerInstance }),
  })
  const logger = new Logger()
  const configService = app.get(ConfigService)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.setGlobalPrefix('api')

  await app.listen(configService.get<number>('APP_PORT') || 3000, async () =>
    logger.verbose(`Application running at: ${await app.getUrl()}`),
  )
}

bootstrap()
