import { Inject, Injectable } from '@nestjs/common';
import {
  IWinstonLoggerService,
  LogLevels,
  LogOptions,
} from './winston-logger.interface';
import winston, { addColors, format, transports } from 'winston';
import prettier from 'prettier';
import moment from 'moment';

const LOGGER_CONFIG = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    verbose: 'magenta',
    debug: 'white',
  },
  emojis: {
    error: '🔴',
    warn: '🟡',
    info: '🟢',
    http: '🔵',
    verbose: '🟣',
    debug: '⚪',
  },
};

const { colorize, combine, errors, printf } = format;

addColors(LOGGER_CONFIG.colors);

const colorizer = colorize();

@Injectable()
export class WinstonLoggerService implements IWinstonLoggerService {
  private logger: winston.Logger;
  private context: string;
  private logPath;
  private logLevel;
  private logName;

  constructor(@Inject('CONFIG_OPTIONS') private options?: LogOptions) {
    const { logPath, logLevel, logName } = {
      logPath: './logs',
      logLevel: 'debug',
      logName: '',
      ...this.options,
    };
    this.logPath = logPath;
    this.logLevel = logLevel;
    this.logName = logName;

    this.logger = winston.createLogger({
      level: this.logLevel,
      levels: LOGGER_CONFIG.levels,
      format: combine(
        format.json(),
        errors({ stack: true }),
        this.loggerFormat,
      ),
      transports: this.customTransports(this.logPath),
    });
  }

  /**
   *  A function to pretty print message
   *
   * @param message
   * @returns a string of formatted string
   */
  private prettyPrint = (message: unknown) => {
    if (typeof message === 'object') {
      const formattedMessage = prettier.format(
        JSON.stringify(message, null, 4),
        {
          parser: 'json',
        },
      );
      return (
        (Array.isArray(message) ? '' : '\n') +
        formattedMessage.slice(0, formattedMessage.length - 1)
      );
    }

    return message;
  };

  /**
   * Format logger information
   */
  private loggerFormat = printf((info: winston.Logform.TransformableInfo) => {
    const { level, message, durationMs, context, stack } = info;

    const { emojis } = LOGGER_CONFIG;

    const timestamp = `[${colorizer.colorize(
      'info',
      Date.now().toString(),
    )}] ${moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`;

    const emoji = emojis[level as LogLevels];

    const messageLevel = level.toUpperCase().padStart(7, ' ');

    const messageInfo = this.prettyPrint(message);

    const contextInfo = context
      ? `${colorizer.colorize('warn', context)}: `
      : '';

    const errorStack = stack ? `\n${stack}` : '';

    const duration = durationMs
      ? colorizer.colorize('warn', `+${durationMs}ms`)
      : '';

    return (
      timestamp +
      colorizer.colorize(
        level,
        ` [${emoji}${messageLevel}] ${contextInfo}${messageInfo} ${errorStack}`,
      ) +
      duration
    );
  });

  /**
   * Format logger transport
   *
   * .ans extension is for ANSI color file
   * @param filepath
   * @returns
   */
  private customTransports = (filepath = './logs') => {
    const fileDate = moment(new Date()).format('YYYY_MM_DD');
    return [
      new transports.Console(),
      new transports.File({
        filename: `${filepath}/${this.logName}/${fileDate}_error.ans`,
        level: 'error',
      }),
      new transports.File({
        filename: `${filepath}/${this.logName}/${fileDate}_all.ans`,
      }),
    ];
  };

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    const loggerContext = this.logger.child({
      context: context || this.context,
    });
    loggerContext.info(message);
  }

  info(message: any, context?: string) {
    const loggerContext = this.logger.child({
      context: context || this.context,
    });
    loggerContext.info(message);
  }

  http(message: any, context?: string) {
    const loggerContext = this.logger.child({
      context: context || this.context,
    });
    loggerContext.http(message);
  }

  error(message: any, stack?: any, context?: string) {
    const loggerContext = this.logger.child({
      context: context || this.context,
    });
    loggerContext.error(message, stack);
  }

  warn(message: any, context?: string) {
    const loggerContext = this.logger.child({
      context: context || this.context,
    });
    loggerContext.warn(message);
  }

  verbose(message: any, context?: string) {
    const loggerContext = this.logger.child({
      context: context || this.context,
    });
    loggerContext.verbose(message);
  }

  debug(message: any, context?: string) {
    const loggerContext = this.logger.child({
      context: context || this.context,
    });
    loggerContext.debug(message);
  }

  /**
   * Start a timer
   * @param id the timer name
   */
  startTimer(id: number | string) {
    this.logger.profile(id);
  }

  /**
   * End a timer
   * @param id the timer name
   */
  endTimer(id: number | string) {
    this.logger.profile(id);
  }
}
