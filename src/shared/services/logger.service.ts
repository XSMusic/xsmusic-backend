import winston from 'winston';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  let level = 'error';
  if (env === 'development') {
    level = 'debug';
  } else if (env === 'production') {
    level = 'info';
  }
  return level;
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  http: 'green',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm' }),
  winston.format.colorize({ level: true, all: false }),
  winston.format.printf(
    (info) => `${info.timestamp} | ${info.level} | ${info.message}`
  )
);

const formatFile = winston.format.combine(
  winston.format.timestamp({ format: 'DD-MM-YYYY HH:mm' }),
  winston.format.printf(
    (info) => `${info.timestamp} | ${info.level} | ${info.message}`
  )
);

const transports = [
  new winston.transports.Console({
    format: format,
  }),
  new winston.transports.File({
    filename: `logs/error.log`,
    level: 'error',
    format: formatFile,
  }),
  new winston.transports.File({
    filename: `logs/all.log`,
    format: formatFile,
  }),
];

export const Logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});
