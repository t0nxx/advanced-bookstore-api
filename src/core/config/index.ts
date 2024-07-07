import { IAuthConfig } from './auth.config';
import { IDatabaseConfig } from './databse.config';

/**
 * for type safety this is a map of configurations of the app
 * @type IAppConfig
 */
export interface IAppConfig {
  auth: IAuthConfig;
  database: IDatabaseConfig;
  // Add more configurations as needed
}
