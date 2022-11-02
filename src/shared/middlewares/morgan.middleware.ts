import { Logger } from '@services';
import morgan, { StreamOptions } from 'morgan';

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development';
};

export const morganMiddleware = morgan(
  ':method :url :status - :response-time ms',
  {
    stream,
    skip,
  }
);
