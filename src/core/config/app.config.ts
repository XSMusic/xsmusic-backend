import 'dotenv/config';
import { ConfigI } from '@interfaces';

const {
  JWT_SECRET,
  LOGS_ERROR,
  LOGS_HTTP,
  MONGO_URI_TEST,
  MONGO_URI_PRO,
  MONGO_URI_UAT,
  NAME,
  NODE_ENV,
  PATH_PROJECT,
  PATH_UPLOADS,
  PORT,
  FCM_SERVER_KEY,
  GOOGLE_APPLICATION_CREDENTIALS,
  GITHUB_TOKEN,
} = process.env;

const getMongoUri = (): string => {
  if (NODE_ENV === 'test') {
    return MONGO_URI_TEST;
  } else if (NODE_ENV === 'development') {
    return MONGO_URI_UAT;
  } else {
    return MONGO_URI_PRO;
  }
};

export const config: ConfigI = {
  env: NODE_ENV,
  title: NAME,
  port: Number(PORT),
  mongo: {
    uri: getMongoUri(),
    options: {
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
      useNewUrlParser: true,
    },
  },
  seed: JWT_SECRET,
  fcm: {
    server_key: FCM_SERVER_KEY,
  },
  githubToken: GITHUB_TOKEN,
  paths: {
    project: PATH_PROJECT,
    uploads: PATH_UPLOADS,
    googleApplicationCredentials: GOOGLE_APPLICATION_CREDENTIALS,
  },
  logs: {
    http: LOGS_HTTP,
    error: LOGS_ERROR,
  },
};
