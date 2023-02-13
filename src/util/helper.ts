import { IMongoSecret } from 'config/config';

/**
 * A method to convert mongo secret to mongo url
 *
 * @param secret IMongoSecret
 * - host
 * - port
 * - user
 * - pass
 * - dbName
 * @returns
 *
 */
export const toMongoURL = (secret: IMongoSecret) => {
  const { host, port, username, password, dbname } = secret;
  return `mongodb://${username}:${password}@${host}:${port}/${dbname}`;
};
