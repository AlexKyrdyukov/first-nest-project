import * as fs from 'fs';
import * as dotenv from 'dotenv';

const configDefault = dotenv.parse(fs.readFileSync('default.env'));
const configLocal = dotenv.parse(fs.readFileSync('.env'));

const mainConfig = {
  ...configDefault,
  ...configLocal,
};

const config = {
  nodeEnv: mainConfig.NODE_ENV,
  jsonLimit: mainConfig.JSON_LIMIT,
  server: {
    port: mainConfig.SERVER_PORT,
    endointsPrefix: mainConfig.SERVER_ENDPOINTS_PREFIX,
    internalErrorMessage: mainConfig.SERVER_INTERNAL_ERROR_MESSAGE,
    publicFolderName: mainConfig.SERVER_PUBLIC_FOLDER_NAME,
    jsonLimit: mainConfig.SERVER_JSON_LIMIT,
    imageUrl: mainConfig.SERVER_IMAGE_URL,
  },
  hash: {
    salt: mainConfig.PASSWORD_HASH_SALT,
    algorithm: mainConfig.PASSWORD_HASH_TYPE as
      | 'HmacSHA512'
      | 'HmacSHA256'
      | 'HmacSHA384'
      | 'HmacSHA224',
  },
  token: {
    secret: mainConfig.TOKEN_SECRET,
    algorithm: mainConfig.TOKEN_HASH_TYPE as
      | 'HS256'
      | 'HS384'
      | 'HS512'
      | 'RS256'
      | 'RS384'
      | 'RS512'
      | 'ES256'
      | 'ES384'
      | 'ES512'
      | 'PS256'
      | 'PS384'
      | 'PS512'
      | 'none',
    expiresIn: {
      refresh: mainConfig.REFRESH_TOKEN_AUTH_EXPIRATION,
      access: mainConfig.ACCESS_TOKEN_AUTH_EXPIRATION,
    },
  },
  urls: {
    clientApp: mainConfig.CLIENT_APP_URL,
    current: mainConfig.CURRENT_URL,
  },
  postgres: {
    dbPort: mainConfig.POSTGRES_DB_PORT,
    dbHost: mainConfig.POSTGRES_DB_HOST,
    dbUser: mainConfig.POSTGRES_DB_USER,
    dbPassword: mainConfig.POSTGRES_DB_PASSWORD,
    dbName: mainConfig.POSTGRES_DB_NAME,
    dbLogging: mainConfig.POSTGRES_DB_LOGGING === 'true',
  },
};

export default config;
