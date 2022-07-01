"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allow = void 0;
var config_plus_1 = require("config-plus");
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var express_1 = __importStar(require("express"));
var express_ext_1 = require("express-ext");
var http_1 = __importDefault(require("http"));
var logger_core_1 = require("logger-core");
var pg_1 = require("pg");
var pg_extension_1 = require("pg-extension");
// import { createPool } from 'mysql';
// import { PoolManager } from 'mysql-core';
var query_core_1 = require("query-core");
var query_mappers_1 = require("query-mappers");
var config_1 = require("./config");
var context_1 = require("./context");
var route_1 = require("./route");
function allow(access) {
    return function (req, res, next) {
        var origin = req.headers.origin || 'http://localhost:3000';
        if (access.origin.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        res.header('Access-Control-Allow-Credentials', access.credentials);
        res.header('Access-Control-Allow-Methods', access.methods);
        res.setHeader('Access-Control-Allow-Headers', access.headers);
        next();
    };
}
exports.allow = allow;
dotenv_1.default.config();
var conf = (0, config_plus_1.merge)(config_1.config, process.env, config_1.env, process.env.ENV);
var app = (0, express_1.default)();
var logger = (0, logger_core_1.createLogger)(conf.log);
var middleware = new express_ext_1.MiddlewareLogger(logger.info, conf.middleware);
app.use(allow(conf.allow), (0, express_1.json)(), (0, cookie_parser_1.default)(), middleware.log);
var templates = (0, express_ext_1.loadTemplates)(conf.template, query_mappers_1.buildTemplates, query_mappers_1.trim, ['./src/query.xml']);
var pool = new pg_1.Pool(config_1.config.db);
// const pool = createPool(config.db);
var db = (0, query_core_1.log)(new pg_extension_1.PoolManager(pool), conf.log.db, logger, 'postgres');
var ctx = (0, context_1.useContext)(db, logger, middleware, conf, pool, templates);
(0, route_1.route)(app, ctx, conf.secure);
http_1.default.createServer(app).listen(conf.port, function () {
    console.log('Start server at port ' + conf.port);
});
//# sourceMappingURL=app.js.map