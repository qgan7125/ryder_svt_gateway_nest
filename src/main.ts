import * as fs from 'fs';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WinstonLoggerService } from './winston-logger/winston-logger.service';
import configuration from 'config/config.json';
import { LogOptions } from 'winston-logger/winston-logger.interface';
import generalMiddleware from 'middleware';

const httpsOptions = {
  key: fs.readFileSync(join(__dirname, './security/private.pem'), 'utf8'),
  cert: fs.readFileSync(join(__dirname, './security/file.crt'), 'utf8'),
};

async function bootstrap() {
  const config = new ConfigService(configuration);
  const logName = config.get<string>('logName');
  const port = config.get<string>('server.port');

  const Logger = new WinstonLoggerService({
    logName: logName,
  } as LogOptions);

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: Logger,
  });

  app.use(generalMiddleware());

  await app.listen(port, '0.0.0.0');

  Logger.info(
    `The Ryder SVT GATEWAY started at ${await app.getUrl()}`,
    'Initialization',
  );

  app.enableShutdownHooks();
}
bootstrap();
