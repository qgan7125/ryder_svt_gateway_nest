import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { WinstonLoggerService } from 'winston-logger/winston-logger.service';

@Injectable()
export class MongoService implements OnModuleInit, OnApplicationShutdown {
  constructor(
    @InjectConnection() private connection: Connection,
    private Logger: WinstonLoggerService,
  ) {
    this.Logger.setContext('MongoService');
  }

  onModuleInit() {
    if (this.connection.readyState === 1) {
      const { host, port } = this.connection;
      this.Logger.info(`DB connected at PORT ${port}`);
    }
    this.connection.on('reconnected', () => {
      this.Logger.info('MongoDB is reconnected.');
    });
    this.connection.on('disconnected', () => {
      this.Logger.warn('MongoDB is disconnected.');
    });
    this.connection.on('error', (err) => {
      this.Logger.error(`MongoDB connection failed: ${err}`);
    });
  }

  onApplicationShutdown() {
    this.connection.removeAllListeners();
    this.Logger.warn('MongoDB terminated by process exit!');
  }
}
