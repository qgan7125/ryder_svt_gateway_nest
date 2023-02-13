export interface IWinstonLoggerService {
  log(message: any, context?: string): any;
  info(message: any, context?: string): any;
  http(message: any, context?: string): any;
  error(message: any, context?: string): any;
  warn(message: any, context?: string): any;
  verbose(message: any, context?: string): any;
  debug(message: any, context?: string): any;
  startTimer(id: number | string): any;
  endTimer(id: number | string): any;
}

export type LogLevels =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug';

export interface LogOptions {
  logPath: string;
  logLevel: string;
  logName: string;
}
