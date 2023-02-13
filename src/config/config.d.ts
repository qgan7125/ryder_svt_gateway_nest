export interface IMongoSecret {
  host: string;
  port: string;
  username: string;
  password: string;
  dbname: string;
}

export interface IMongoConfig {
  serverSelectionTimeoutMS: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface IServerConfig {
  port: number;
  bodyLimit: string;
  corsHeaders: string[] | string;
}
