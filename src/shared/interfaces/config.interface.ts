export interface ConfigI {
  env: string;
  title: string;
  port: number;
  mongo: {
    uri: string;
    options: any;
  };
  seed: string;
  fcm: {
    server_key: string;
  };
  mailing: {
    email: string;
    password: string;
  };
  tokens: {
    github: string;
    map: string;
    soundcloud: string;
    youtube: string;
  };
  paths: {
    project: string;
    uploads: string;
    googleApplicationCredentials: string;
  };
  logs: {
    http: string;
    error: string;
  };
}
