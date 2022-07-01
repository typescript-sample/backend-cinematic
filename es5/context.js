"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useContext = void 0;
var authen_express_1 = require("authen-express");
var authen_service_1 = require("authen-service");
var express_ext_1 = require("express-ext");
var film_1 = require("./film");
var jsonwebtoken_plus_1 = require("jsonwebtoken-plus");
var ldap_plus_1 = require("ldap-plus");
var query_core_1 = require("query-core");
var security_express_1 = require("security-express");
var types_validation_1 = require("types-validation");
var xvalidators_1 = require("xvalidators");
var audit_log_1 = require("./audit-log");
var role_1 = require("./role");
var user_1 = require("./user");
var category_1 = require("./category");
var cinemaparent_1 = require("./cinemaparent");
var cinema_1 = require("./cinema");
var UploadController_1 = require("./uploads/UploadController");
var SqlUploadsService_1 = require("./uploads/SqlUploadsService");
var google_storage_1 = require("google-storage");
var storage_1 = require("@google-cloud/storage");
var pg_extension_1 = require("pg-extension");
var rate_1 = require("./rate");
express_ext_1.resources.createValidator = xvalidators_1.createValidator;
express_ext_1.resources.check = types_validation_1.check;
var credentials = {
    type: 'service_account',
    project_id: 'go-firestore-rest-api',
    private_key_id: '0227f21f734620a0a04a3882249f3b1cb1ab634a',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCrzi/hC6NsGZyR\nc2rurmpACAn5FggHjrUshXCqbsoQUPvrMhTEPQk56hQdHNlMl+ZNue94Cv7D3LCR\nlHu68XOsPAhnx21LHPsMplIobjnXWn+fD+Ow6zvHp9RalS40PrVYS1uuIVYjeets\n8dtdFB3G9ka7Zv8oz4WBN4S18sXsV702OaBMo2IwfArTk2DCY6KYqcNEVde0sd/q\nH6pK1GvDPkgbtcklk5fUgkNz61nufnqYujsnx57GuDT9ZbreAcYTB5/hRcgMjyM6\n8tgYXdjmJLFdTsMABT/YsQ0OmDDwhVQrc0CixZtzMXg+jLRxKZuHELQ+nkJCKJBi\nTtQJ1f+dAgMBAAECggEACdL2+uvi8uX+BXUvmqlfivzKsTMYz3HSG1MgD6bZKBix\nZxAMjvIcinK/prCFHnObKDunHVqnmcSPVivC7XwsDJ+8LU8CiWaFVoJWNVikNxPG\nM27BqtawquiGZI2eQD+LuBpLCkh+t/WbSDYGQKrLTxq7DbFEiu1e6XYmwQ66UZrU\ny1U7YuRw2ML+6BiHaSdq3FH3wvBbsAfwZoNnqdqTjaj01EkNsi/lOmFXHY8gPOA1\nGRI20R4KhRkctIC4ZztXg50bRzuIkz+YX57F36kEqpLaXePUQ/pHWg+76rsCd2dD\nIrcQF8Y+Hbp4eP+7CBu3AUltOzuNeC6h69B8MKCrowKBgQDTCrzCD0SThL+6NcPR\njzwFydDbapfgzGYvleEOEUTy2akAdydrcAHlMDcuUZv7xyjam5CVS/B4vLRynl6J\n8KHkdAuU8ZLESdnfo2X9GgJWBw/RK6spebEcslWINVJWwWWsQrtjMr58WVS4hWAE\nxBIKumhf5/EICZW+BueT3j0WtwKBgQDQZ6tFc3OGE0YFVIQkalQd751dsgtjQhVZ\n4huwzaUZdtFlNJm1B6yVn9ksGAM2q0iCxDQBPOM7AF+nEpeBz+pMmdpWiOb6sKC6\nVoqIgts7lNMp2h4kJLUePgWVarbuACS1VX3qSpqdcklaAi+5WnObzC8bsmaLbZxp\nmpk4gvpoSwKBgEjoj7d3MNjJ5ra89k6CblkNlNMIqzmlQ7Qy0lJa0vgXDBS2FW8/\nfdgg5R9iYEIGVu3XCocZehUsFCb44W5ELJnRIWMuZebcIKHrQEPFZYM041j+/h3R\nBcgFMBljWnPQUoDFeRlXIYmyDtvEcByVZCpCpeZkKdf9/7ZrijuCbpZXAoGARY4k\nEoTqzJfIKeVASSsXsfoUCn5u4IzgtWQKm+K2tJ38WwvINSw/hJyaDeZhxDA8fjBf\nrv4UVM/WHNvOpyuuZix/O5xrgsXKjwZtLAyIgQU1yOUcZDHAJTzL/kdkkGCJ39+N\nq9GEcwH+y0SpivJOXXQzUMolAWnu5ywK8Vp9mqsCgYBaCkZuQ3xMkWPSYWwJ2mpq\nBrH0Zpk3ddDGo63w97C9z7zX6tIP1uxVvKVGA3LQPaj8Zvbuks8DYWV8a/6RGIP/\nTH5On0uX/VNkI1Wk9R3tstyzz7MRaBAHQOt26/le/XOptcJXWB29uKEJPpq/sfHb\nx66rIAZO4BgLcslDTj3Y2g==\n-----END PRIVATE KEY-----\n',
    client_email: 'go-firestore-rest-api@appspot.gserviceaccount.com',
    client_id: '106958727954036268529',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/go-firestore-rest-api%40appspot.gserviceaccount.com',
};
function useContext(db, logger, midLogger, conf, pool, mapper) {
    var auth = conf.auth;
    var log = new express_ext_1.LogController(logger);
    var middleware = new express_ext_1.MiddlewareController(midLogger);
    var sqlChecker = (0, query_core_1.createChecker)(db);
    var health = new express_ext_1.HealthController([sqlChecker]);
    var privilegeLoader = new security_express_1.PrivilegeLoader(conf.sql.permission, db.query);
    var token = (0, security_express_1.useToken)(auth.token.secret, jsonwebtoken_plus_1.verify, jsonwebtoken_plus_1.buildJwtError, conf.cookie);
    var authorizer = new security_express_1.Authorizer(token, privilegeLoader.privilege, jsonwebtoken_plus_1.buildJwtError, true);
    var status = (0, authen_service_1.initializeStatus)(auth.status);
    var privilegeRepository = new authen_service_1.PrivilegeRepository(db.query, conf.sql.privileges);
    var userRepository = (0, authen_service_1.useUserRepository)(db, auth);
    var authenticate = (0, ldap_plus_1.useLDAP)(conf.ldap, status);
    var authenticator = (0, authen_service_1.useAuthenticator)(status, authenticate, jsonwebtoken_plus_1.generate, auth.token, auth.payload, auth.account, userRepository, privilegeRepository.privileges, auth.lockedMinutes, auth.maxPasswordFailed);
    var authentication = new authen_express_1.AuthenticationController(logger.error, authenticator.authenticate, conf.cookie);
    var privilegesLoader = new authen_service_1.PrivilegesReader(db.query, conf.sql.allPrivileges);
    var privilege = new authen_express_1.PrivilegeController(logger.error, privilegesLoader.privileges);
    var role = (0, role_1.useRoleController)(logger.error, db, mapper);
    var user = (0, user_1.useUserController)(logger.error, db, mapper);
    var auditLog = (0, audit_log_1.useAuditLogController)(logger.error, db);
    var film = (0, film_1.useFilmController)(logger.error, db, mapper);
    var filmRate = (0, film_1.useFilmRateController)(logger.error, db, mapper);
    var category = (0, category_1.useCategoryController)(logger.error, db, mapper);
    var cinemaParent = (0, cinemaparent_1.useCinemaParentController)(logger.error, db, mapper);
    var cinema = (0, cinema_1.useCinemaController)(logger.error, db, mapper);
    var cinemaRate = (0, cinema_1.useCinemaRateController)(logger.error, db, mapper);
    var rate = (0, rate_1.useRateController)(logger.error, db, mapper);
    // const healthChecker2  =new Checker2('mongo',"https://localhost:443/health",5000);
    // const health2 = new HealthController2([healthChecker2])
    var manager = new pg_extension_1.PoolManager(pool);
    var storageConfig = { bucket: 'go-firestore-rest-api.appspot.com', public: true };
    var storage = new storage_1.Storage({ credentials: credentials });
    var bucket = storage.bucket('go-firestore-rest-api.appspot.com');
    var storageService = new google_storage_1.GoogleStorageService(bucket, storageConfig, google_storage_1.map);
    var uploadService = new SqlUploadsService_1.SqlUploadSerive(pool, 'media', storageService.upload, storageService.delete, pg_extension_1.param, manager.query, manager.exec, manager.execBatch);
    var uploads = new UploadController_1.UploadController(logger.error, uploadService);
    return { health: health, log: log, middleware: middleware, authorize: authorizer.authorize, authentication: authentication, privilege: privilege, role: role, user: user, auditLog: auditLog, film: film, category: category, cinema: cinema, cinemaParent: cinemaParent, uploads: uploads, filmRate: filmRate, cinemaRate: cinemaRate, rate: rate };
}
exports.useContext = useContext;
//# sourceMappingURL=context.js.map