import { categoryModel } from './category/category';
import { Application } from 'express';
import { check } from 'express-ext';
import multer from 'multer';
import { del, get, patch, post, put, read, write } from 'security-express';
import { Context } from './context';
import { filmModel } from './film/film';
import { L } from 'logger-core';

export function route(app: Application, ctx: Context, secure: boolean): void {
  const parser = multer();
  app.get('/health', ctx.health.check);
  app.patch('/log', ctx.log.config);
  app.patch('/middleware', ctx.middleware.config);
  app.post('/authenticate', parser.none(), ctx.authentication.authenticate);

  const readRole = ctx.authorize('role', read);
  const writeRole = ctx.authorize('role', write);
  get(app, '/privileges', readRole, ctx.privilege.all, secure);
  put(app, '/roles/:id/assign', writeRole, ctx.role.assign, secure);
  get(app, '/roles', readRole, ctx.role.search, secure);
  post(app, '/roles/search', readRole, ctx.role.search, secure);
  get(app, '/roles/search', readRole, ctx.role.search, secure);
  get(app, '/roles/:id', readRole, ctx.role.load, secure);
  post(app, '/roles', writeRole, ctx.role.create, secure);
  put(app, '/roles/:id', writeRole, ctx.role.update, secure);
  patch(app, '/roles/:id', writeRole, ctx.role.patch, secure);
  del(app, '/roles/:id', writeRole, ctx.role.delete, secure);

  const readUser = ctx.authorize('user', read);
  const writeUser = ctx.authorize('user', write);
  get(app, '/users', readUser, ctx.user.all, secure);
  post(app, '/users/search', readUser, ctx.user.search, secure);
  get(app, '/users/search', readUser, ctx.user.search, secure);
  get(app, '/users/:id', readUser, ctx.user.load, secure);
  post(app, '/users', writeUser, ctx.user.create, secure);
  put(app, '/users/:id', writeUser, ctx.user.update, secure);
  patch(app, '/users/:id', writeUser, ctx.user.patch, secure);
  del(app, '/users/:id', writeUser, ctx.user.delete, secure);

  const readAuditLog = ctx.authorize('audit_log', read);
  get(app, '/audit-logs', readAuditLog, ctx.auditLog.search, secure);
  get(app, '/audit-logs/search', readAuditLog, ctx.auditLog.search, secure);
  post(app, '/audit-logs/search', readAuditLog, ctx.auditLog.search, secure);

  
const checkCategory = check(categoryModel);
const checkFilm = check(filmModel);
app.get('/categories', ctx.category.all);
app.post('/categories',checkCategory,ctx.category.create);
app.get('/categories/search',checkCategory,ctx.category.search);
app.get('/categories/:id',ctx.category.load);
app.put('/categories/:id',checkCategory,ctx.category.update);
app.patch('/categories/:id',checkCategory,ctx.category.patch);

app.delete('/categories/:id',checkCategory,ctx.category.delete);


app.get('/films', ctx.film.all);
app.post('/films',checkFilm,ctx.film.create);
app.get('/films/search',checkFilm,ctx.film.search);
app.post('/films/search',checkFilm,ctx.film.search);
app.get('/films/:id',ctx.film.load);
app.put('/films/:id',checkFilm,ctx.film.update);
app.patch('/films/:id',checkFilm,ctx.film.patch );
app.delete('/films/:id',checkFilm,ctx.film.delete);


}
