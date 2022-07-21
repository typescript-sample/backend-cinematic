import { merge } from 'config-plus';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express, { json, NextFunction } from 'express';
import { Request, Response } from 'express';
import { loadTemplates, MiddlewareLogger } from 'express-ext';
import http from 'http';
import { createLogger } from 'logger-core';
import { Pool } from 'pg';
import { PoolManager } from 'pg-extension';
// import { createPool } from 'mysql';
// import { PoolManager } from 'mysql-core';
import { log } from 'query-core';
import { buildTemplates, trim } from 'query-mappers';
import { config, env } from './config';
import { useContext } from './context';
import { route } from './route';
export interface AccessConfig {
  origin: string | string[];
  credentials: string | string[];
  methods: string | string[];
  headers: number | string | ReadonlyArray<string>;
}
export type AccessControlAllowConfig = AccessConfig;
export function allow(access: AccessConfig): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin || 'http://localhost:3000';
    if (access.origin.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', access.credentials);
    res.header('Access-Control-Allow-Methods', access.methods);
    res.setHeader('Access-Control-Allow-Headers', access.headers);
    next();
  };
}

dotenv.config();
const conf = merge(config, process.env, env, process.env.ENV);

const app = express();
const logger = createLogger(conf.log);
const middleware = new MiddlewareLogger(logger.info, conf.middleware);
app.use(allow(conf.allow), json(), cookieParser(), middleware.log);

const templates = loadTemplates(conf.template, buildTemplates, trim, ['./src/query.xml']);
const pool = new Pool(config.db);
// const pool = createPool(config.db);
const db = log(new PoolManager(pool), conf.log.db, logger, 'postgres');
const ctx = useContext(db, logger, middleware, conf, pool, templates);
route(app, ctx, conf.secure);
http.createServer(app).listen(conf.port, () => {
  console.log('Start server at port ' + conf.port);
});
