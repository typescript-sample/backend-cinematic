import { Storage } from '@google-cloud/storage';
import { AuthenticationController, PrivilegeController } from 'authen-express';
import { initializeStatus, PrivilegeRepository, PrivilegesReader, SqlAuthConfig, useAuthenticator, User, useUserRepository } from 'authen-service';
import { CategoryController } from 'category/category-controller';
import { CinemaRateController } from 'cinema/cinema-rate-controller';
import { HealthController, LogController, Logger, Middleware, MiddlewareController, resources } from 'express-ext';
import { GoogleStorageService, map, StorageConfig } from 'google-storage';
import { buildJwtError, generate, Payload, verify } from 'jsonwebtoken-plus';
import { Conf, useLDAP } from 'ldap-plus';
import { Pool } from 'pg';
import { param, PoolManager } from 'pg-extension';
import { createChecker, DB } from 'query-core';
import { TemplateMap } from 'query-mappers';
import { Authorize, Authorizer, PrivilegeLoader, useToken } from 'security-express';
import { check } from 'types-validation';
import { createValidator } from 'xvalidators';
import { useAppreciationController, useAppreciationReplyController } from './appreciation';
import { AppreciationController } from './appreciation/appreciation-controller';
import { AppreciationReplyController } from './appreciation/reply-controller';
import { AuditLogController, useAuditLogController } from './audit-log';
import { useCategoryController } from './category';
import { useCinemaController, useCinemaRateController } from './cinema';
import { CinemaController } from './cinema/cinema-controller';
import { CinemaParentController, useCinemaParentController } from './cinemaparent';
import { useFilmController, useFilmRateController } from './film';
import { FilmController } from './film/film-controller';
import { FilmRateController } from './film/film-rate-controller';
import { useRateController, useReplyController } from './rate';
import { RateController } from './rate/rate-controller';
import { ReplyController } from './rate/reply-controller';
import { RoleController, useRoleController } from './role';
import { SqlUploadSerive } from './uploads/SqlUploadsService';
import { UploadController } from './uploads/UploadController';
import { UserController, useUserController } from './user';
resources.createValidator = createValidator;
resources.check = check;

export interface Config {
  cookie?: boolean;
  ldap: Conf;
  auth: SqlAuthConfig;
  sql: {
    allPrivileges: string;
    privileges: string;
    permission: string;
  };
}
export interface Context {
  health: HealthController;
  log: LogController;
  middleware: MiddlewareController;
  // authorize: Authorize;
  // authentication: AuthenticationController<User>;
  // privilege: PrivilegeController;
  role: RoleController;
  user: UserController;
  auditLog: AuditLogController;
  film: FilmController;
  filmRate: FilmRateController;
  category: CategoryController;
  cinemaParent: CinemaParentController;
  cinema: CinemaController;
  cinemaRate: CinemaRateController;
  uploads: UploadController;
  rate: RateController;
  appreciation: AppreciationController;
  appreciationReply: AppreciationReplyController;
  reply: ReplyController;
}

const credentials = {
  type: 'service_account',
  project_id: 'go-firestore-rest-api',
  private_key_id: '0227f21f734620a0a04a3882249f3b1cb1ab634a',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCrzi/hC6NsGZyR\nc2rurmpACAn5FggHjrUshXCqbsoQUPvrMhTEPQk56hQdHNlMl+ZNue94Cv7D3LCR\nlHu68XOsPAhnx21LHPsMplIobjnXWn+fD+Ow6zvHp9RalS40PrVYS1uuIVYjeets\n8dtdFB3G9ka7Zv8oz4WBN4S18sXsV702OaBMo2IwfArTk2DCY6KYqcNEVde0sd/q\nH6pK1GvDPkgbtcklk5fUgkNz61nufnqYujsnx57GuDT9ZbreAcYTB5/hRcgMjyM6\n8tgYXdjmJLFdTsMABT/YsQ0OmDDwhVQrc0CixZtzMXg+jLRxKZuHELQ+nkJCKJBi\nTtQJ1f+dAgMBAAECggEACdL2+uvi8uX+BXUvmqlfivzKsTMYz3HSG1MgD6bZKBix\nZxAMjvIcinK/prCFHnObKDunHVqnmcSPVivC7XwsDJ+8LU8CiWaFVoJWNVikNxPG\nM27BqtawquiGZI2eQD+LuBpLCkh+t/WbSDYGQKrLTxq7DbFEiu1e6XYmwQ66UZrU\ny1U7YuRw2ML+6BiHaSdq3FH3wvBbsAfwZoNnqdqTjaj01EkNsi/lOmFXHY8gPOA1\nGRI20R4KhRkctIC4ZztXg50bRzuIkz+YX57F36kEqpLaXePUQ/pHWg+76rsCd2dD\nIrcQF8Y+Hbp4eP+7CBu3AUltOzuNeC6h69B8MKCrowKBgQDTCrzCD0SThL+6NcPR\njzwFydDbapfgzGYvleEOEUTy2akAdydrcAHlMDcuUZv7xyjam5CVS/B4vLRynl6J\n8KHkdAuU8ZLESdnfo2X9GgJWBw/RK6spebEcslWINVJWwWWsQrtjMr58WVS4hWAE\nxBIKumhf5/EICZW+BueT3j0WtwKBgQDQZ6tFc3OGE0YFVIQkalQd751dsgtjQhVZ\n4huwzaUZdtFlNJm1B6yVn9ksGAM2q0iCxDQBPOM7AF+nEpeBz+pMmdpWiOb6sKC6\nVoqIgts7lNMp2h4kJLUePgWVarbuACS1VX3qSpqdcklaAi+5WnObzC8bsmaLbZxp\nmpk4gvpoSwKBgEjoj7d3MNjJ5ra89k6CblkNlNMIqzmlQ7Qy0lJa0vgXDBS2FW8/\nfdgg5R9iYEIGVu3XCocZehUsFCb44W5ELJnRIWMuZebcIKHrQEPFZYM041j+/h3R\nBcgFMBljWnPQUoDFeRlXIYmyDtvEcByVZCpCpeZkKdf9/7ZrijuCbpZXAoGARY4k\nEoTqzJfIKeVASSsXsfoUCn5u4IzgtWQKm+K2tJ38WwvINSw/hJyaDeZhxDA8fjBf\nrv4UVM/WHNvOpyuuZix/O5xrgsXKjwZtLAyIgQU1yOUcZDHAJTzL/kdkkGCJ39+N\nq9GEcwH+y0SpivJOXXQzUMolAWnu5ywK8Vp9mqsCgYBaCkZuQ3xMkWPSYWwJ2mpq\nBrH0Zpk3ddDGo63w97C9z7zX6tIP1uxVvKVGA3LQPaj8Zvbuks8DYWV8a/6RGIP/\nTH5On0uX/VNkI1Wk9R3tstyzz7MRaBAHQOt26/le/XOptcJXWB29uKEJPpq/sfHb\nx66rIAZO4BgLcslDTj3Y2g==\n-----END PRIVATE KEY-----\n',
  client_email: 'go-firestore-rest-api@appspot.gserviceaccount.com',
  client_id: '106958727954036268529',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/go-firestore-rest-api%40appspot.gserviceaccount.com',
};

export function useContext(db: DB, logger: Logger, midLogger: Middleware, conf: Config, pool: Pool, mapper?: TemplateMap): Context {
  const auth = conf.auth;
  const log = new LogController(logger);
  const middleware = new MiddlewareController(midLogger);
  const sqlChecker = createChecker(db);
  const health = new HealthController([sqlChecker]);
  const privilegeLoader = new PrivilegeLoader(conf.sql.permission, db.query);
  const token = useToken<Payload>(auth.token.secret, verify, buildJwtError, conf.cookie);
  const authorizer = new Authorizer<Payload>(token, privilegeLoader.privilege, buildJwtError, true);

  const status = initializeStatus(auth.status);
  const privilegeRepository = new PrivilegeRepository(db.query, conf.sql.privileges);
  const userRepository = useUserRepository(db, auth);
  // const authenticate = useLDAP(conf.ldap, status);
  // const authenticator = useAuthenticator(status, authenticate, generate, auth.token, auth.payload, auth.account, userRepository, privilegeRepository.privileges, auth.lockedMinutes, auth.maxPasswordFailed);
  // const authentication = new AuthenticationController(logger.error, authenticator.authenticate, conf.cookie);
  // const privilegesLoader = new PrivilegesReader(db.query, conf.sql.allPrivileges);
  // const privilege = new PrivilegeController(logger.error, privilegesLoader.privileges);

  const role = useRoleController(logger.error, db, mapper);
  const user = useUserController(logger.error, db, mapper);

  const auditLog = useAuditLogController(logger.error, db);

  const film = useFilmController(logger.error, db, mapper);
  const filmRate = useFilmRateController(logger.error, db, mapper);
  const category = useCategoryController(logger.error, db, mapper);

  const cinemaParent = useCinemaParentController(logger.error, db, mapper);
  const cinema = useCinemaController(logger.error, db, mapper);
  const cinemaRate = useCinemaRateController(logger.error, db, mapper);

  const rate = useRateController(logger.error, db, mapper);
  const appreciation = useAppreciationController(logger.error, db, mapper);
  const appreciationReply = useAppreciationReplyController(logger.error, db, mapper);
  const reply = useReplyController(logger.error, db, mapper);
  // const healthChecker2  =new Checker2('mongo',"https://localhost:443/health",5000);
  // const health2 = new HealthController2([healthChecker2])
  const manager = new PoolManager(pool);
  const storageConfig: StorageConfig = { bucket: 'go-firestore-rest-api.appspot.com', public: true };
  const storage = new Storage({ credentials });
  const bucket = storage.bucket('go-firestore-rest-api.appspot.com');
  const storageService = new GoogleStorageService(bucket, storageConfig, map);
  const uploadService = new SqlUploadSerive(pool, 'media', storageService.upload, storageService.delete, param, manager.query, manager.exec, manager.execBatch);
  const uploads = new UploadController(logger.error, uploadService);
  return { health, log, middleware, role, user, auditLog, film, category, cinema, cinemaParent, uploads, filmRate, cinemaRate, rate, appreciation, appreciationReply, reply };
}
