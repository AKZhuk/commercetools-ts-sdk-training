import { createApiBuilderFromCtpClient as createImportApiBuilderFromCtpClient } from '@commercetools/importapi-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import {
    AuthMiddlewareOptions,
    ClientBuilder,
    HttpMiddlewareOptions,
    PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { ApiRoot, ImportApiRoot } from '../types/global';
import { Prefix, Config, readConfig } from '../utils/config';

const config: Config = readConfig(Prefix.CTP)
const projectKey = config.projectKey;

const createApiClient = () => {
  const authMiddlewareOptions: AuthMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: config.projectKey,
    credentials: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    },
    scopes: [process.env.CTP_SCOPES!],
    fetch,
  };

  // Configure httpMiddlewareOptions
  const httpMiddlewareOptions: HttpMiddlewareOptions = {
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
  };

  const ctpClient = new ClientBuilder()
    .withProjectKey(projectKey)
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    // .withLoggerMiddleware()
    .build();

  return createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey });
}

const createImportApiClient = () => {
  throw new Error('Function not implemented');
};

const createStoreApiClient = () => {
  throw new Error('Function not implemented');
};

const createMyApiClient = () => {
  throw new Error('Function not implemented');
};

export const apiRoot: ApiRoot = createApiClient();
// export const importApiRoot: ImportApiRoot = createImportApiClient();
// export const storeApiRoot: ApiRoot = createStoreApiClient();
// export const myApiRoot: ApiRoot = createMyApiClient();
