import { DynamicModule, Global, Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger.service';
import { LogOptions } from './winston-logger.interface';

@Global()
@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class WinstonLoggerModule {
  static register(options: LogOptions): DynamicModule {
    return {
      module: WinstonLoggerModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        WinstonLoggerService,
      ],
      exports: [WinstonLoggerService],
    };
  }
}
