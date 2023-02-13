import express, { Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import configuration from 'config/config.json';
import { WinstonLoggerService } from 'winston-logger/winston-logger.service';
import { ConfigService } from '@nestjs/config';
import { LogOptions } from 'winston-logger/winston-logger.interface';
import { IServerConfig } from 'config/config';

const config = new ConfigService(configuration);
const logName = config.get<string>('logName');
const Logger = new WinstonLoggerService({
  logName: logName,
} as LogOptions);
const { bodyLimit, corsHeaders } = config.get<IServerConfig>('server');

/**
 * A application level middleware including http report and docs routes
 *
 * @returns
 */
const generalMiddleware = () => {
  const middleware = Router();

  // helmet: https://helmetjs.github.io/
  middleware.use(helmet());

  // morgan: Library to print http endpoint info
  middleware.use(
    morgan(
      ':method :url :status content-length::res[content-length] - :response-time ms',
      {
        stream: {
          // Configure Morgan to use our custom logger with the http severity
          write: (message) => Logger.http(message.trim()),
        },
      },
    ),
  );

  middleware.use(
    cors({
      exposedHeaders: corsHeaders,
    }),
  );

  // Customized middleware, add block
  middleware.use((req: Request, res: Response, next: NextFunction) => {
    Logger.http('------------------------------------------------------');
    next();
  });

  middleware.use(express.json({ limit: bodyLimit }));

  // catch `SyntaxError` in body parse
  //https://stackoverflow.com/questions/58134287/catch-error-for-bad-json-format-thrown-by-express-json-middleware
  middleware.use(
    (err: any, req: Request, res: Response, next: NextFunction) => {
      if (
        err instanceof SyntaxError &&
        (err as any).status === 400 &&
        'body' in err
      ) {
        Logger.error('SyntaxError', (err as any).body);
        return res.status(400).send({ message: (err as any).message }); // Bad request
      }
      next();
    },
  );

  return middleware;
};

export default generalMiddleware;
