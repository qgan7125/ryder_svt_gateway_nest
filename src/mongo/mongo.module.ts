import { Global, Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { IMongoConfig, IMongoSecret } from 'config/config';
import { toMongoURL } from 'util/helper';
import { WinstonLoggerService } from 'winston-logger/winston-logger.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<IMongoSecret>('mongodb');
        return {
          uri: toMongoURL(secret),
          ...configService.get<IMongoConfig>('mongoConfig'),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MongoService],
})
export class MongoModule {
  constructor(private Logger: WinstonLoggerService) {
    this.Logger.info('Database is connecting...', 'MongoModule');
  }
}
