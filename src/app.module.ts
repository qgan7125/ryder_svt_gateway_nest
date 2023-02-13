import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonLoggerModule } from './winston-logger/winston-logger.module';
import configuration from 'config/config.json';
import { LogOptions } from 'winston-logger/winston-logger.interface';
import { MongoModule } from './mongo/mongo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import EventEmitter from 'events';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [() => configuration],
      isGlobal: true,
    }),
    WinstonLoggerModule.register({
      logName: configuration['logName'],
    } as LogOptions),
    MongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {
    // Avoid node event possible EventEmitter memory leak detected
    // https://github.com/Automattic/mongoose/issues/1992
    EventEmitter.setMaxListeners(
      this.configService.get<number>('MAX_LISTENERS_COUNT'),
    );
  }
}
