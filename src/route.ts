import { Application } from 'express';
import { check } from 'express-ext';
import multer from 'multer';
import { categoryModel } from './category/category';
import { cinemaModel } from './cinema/cinema';
import { Context } from './context';
import { filmModel } from './film/film';

export function route(app: Application, ctx: Context, secure: boolean): void {
  const parser = multer();
  app.get('/health', ctx.health.check);
  // app.get('/healthcheck', ctx.health2.check);
  app.patch('/log', ctx.log.config);
  app.patch('/middleware', ctx.middleware.config);
  // app.post('/authenticate', parser.none(), ctx.authentication.authenticate);

  // const readRole = ctx.authorize('role', read);
  // const writeRole = ctx.authorize('role', write);
  // get(app, '/privileges', readRole, ctx.privilege.all, secure);
  // put(app, '/roles/:id/assign', writeRole, ctx.role.assign, secure);
  // get(app, '/roles', readRole, ctx.role.search, secure);
  // post(app, '/roles/search', readRole, ctx.role.search, secure);
  // get(app, '/roles/search', readRole, ctx.role.search, secure);
  // get(app, '/roles/:id', readRole, ctx.role.load, secure);
  // post(app, '/roles', writeRole, ctx.role.create, secure);
  // put(app, '/roles/:id', writeRole, ctx.role.update, secure);
  // patch(app, '/roles/:id', writeRole, ctx.role.patch, secure);
  // del(app, '/roles/:id', writeRole, ctx.role.delete, secure);

  // const readUser = ctx.authorize('user', read);
  // const writeUser = ctx.authorize('user', write);
  // get(app, '/users', readUser, ctx.user.all, secure);
  // post(app, '/users/search', readUser, ctx.user.search, secure);
  // get(app, '/users/search', readUser, ctx.user.search, secure);
  // get(app, '/users/:id', readUser, ctx.user.load, secure);
  // post(app, '/users', writeUser, ctx.user.create, secure);
  // put(app, '/users/:id', writeUser, ctx.user.update, secure);
  // patch(app, '/users/:id', writeUser, ctx.user.patch, secure);
  // del(app, '/users/:id', writeUser, ctx.user.delete, secure);

  // const readAuditLog = ctx.authorize('audit_log', read);
  // get(app, '/audit-logs', readAuditLog, ctx.auditLog.search, secure);
  // get(app, '/audit-logs/search', readAuditLog, ctx.auditLog.search, secure);
  // post(app, '/audit-logs/search', readAuditLog, ctx.auditLog.search, secure);


  const checkCategory = check(categoryModel);
  const checkFilm = check(filmModel);
  // const checkFilmRate = check(filmRateModel);
  const checkCinema = check(cinemaModel);



// const readCinemaParent = ctx.authorize('cinemaParent', read);
// const writeCinemaParent = ctx.authorize('cinemaParent', write);

//   // get(app, '/cinemaParent', readCinemaParent, ctx.cinemaParent.all, secure);
//   post(app, '/cinemaParent/search', readCinemaParent, ctx.cinemaParent.search, secure);
//   get(app, '/cinemaParent/search', readCinemaParent, ctx.cinemaParent.search, secure);
//   get(app, '/cinemaParent/:id', readCinemaParent, ctx.cinemaParent.load, secure);
//   post(app, '/cinemaParent', writeCinemaParent, ctx.cinemaParent.create, secure);
//   put(app, '/cinemaParent/:id', writeCinemaParent, ctx.cinemaParent.update, secure);
//   patch(app, '/cinemaParent/:id', writeCinemaParent, ctx.cinemaParent.patch, secure);
//   del(app, '/cinemaParent/:id', writeCinemaParent, ctx.cinemaParent.delete, secure);

// const readCinema = ctx.authorize('cinema', read);
// const writeCinema = ctx.authorize('cinema', write);
// // get(app, '/cinemaParent', readCinemaParent, ctx.cinemaParent.all, secure);
//   post(app, '/cinema/search', readCinema, ctx.cinema.search, secure);
//   get(app, '/cinema/search', readCinema, ctx.cinema.search, secure);
//   get(app, '/cinema/:id', readCinema, ctx.cinema.load, secure);
//   post(app, '/cinema', writeCinema, ctx.cinema.create, secure);
//   put(app, '/cinema/:id', writeCinema, ctx.cinema.update, secure);
//   patch(app, '/cinema/:id', writeCinema, ctx.cinema.patch, secure);
//   del(app, '/cinema/:id', writeCinema, ctx.cinema.delete, secure);

  app.get('/categories', ctx.category.all);
  app.post('/categories', checkCategory, ctx.category.create);
  app.get('/categories/search', checkCategory, ctx.category.search);
  app.get('/categories/:id', ctx.category.load);
  app.put('/categories/:id', checkCategory, ctx.category.update);
  app.patch('/categories/:id', checkCategory, ctx.category.patch);
  app.delete('/categories/:id', checkCategory, ctx.category.delete);

  // app.post('/film-rate/search', ctx.filmRate.search);
  // app.get('/film-rate/search', ctx.filmRate.search);
  // app.post('/film-rate/useful', ctx.filmRate.usefulFilm);
  // app.post('/film-rate/useful/search', ctx.filmRate.usefulSearch);


  // app.post('/films/rate', checkFilmRate, ctx.film.rate);
  // app.post('/film-rate/search', ctx.filmRate.search);
  // app.get('/film-rate/search', ctx.filmRate.search);

  // const readCinemaParent = ctx.authorize('cinemaParent', read);
  // const writeCinemaParent = ctx.authorize('cinemaParent', write);

  // get(app, '/cinemaParent', readCinemaParent, ctx.cinemaParent.all, secure);
  // post(app, '/cinemaParent/search', readCinemaParent, ctx.cinemaParent.search, secure);
  // get(app, '/cinemaParent/search', readCinemaParent, ctx.cinemaParent.search, secure);
  // get(app, '/cinemaParent/:id', readCinemaParent, ctx.cinemaParent.load, secure);
  // post(app, '/cinemaParent', writeCinemaParent, ctx.cinemaParent.create, secure);
  // put(app, '/cinemaParent/:id', writeCinemaParent, ctx.cinemaParent.update, secure);
  // patch(app, '/cinemaParent/:id', writeCinemaParent, ctx.cinemaParent.patch, secure);
  // del(app, '/cinemaParent/:id', writeCinemaParent, ctx.cinemaParent.delete, secure);

  // const readCinema = ctx.authorize('cinema', read);
  // const writeCinema = ctx.authorize('cinema', write);
  // get(app, '/cinemaParent', readCinemaParent, ctx.cinemaParent.all, secure);

  app.get('/films', ctx.film.all);
  app.post('/films', checkFilm, ctx.film.create);
  app.get('/films/search', checkFilm, ctx.film.search);
  app.post('/films/search', checkFilm, ctx.film.search);
  app.get('/films/:id', ctx.film.load);
  app.put('/films/:id', checkFilm, ctx.film.update);
  app.patch('/films/:id', checkFilm, ctx.film.patch);
  app.delete('/films/:id', checkFilm, ctx.film.delete);
  
  app.get('/cinema/comment/search', ctx.comment.search);
  app.post('/cinema/comment/search', ctx.comment.search);
  app.post('/cinema/rates/:id/:author', ctx.rate.rate);
  app.get('/cinema/rates/search/:id/:author', ctx.rate.search);
  app.post('/cinema/rates/search/:id/:author', ctx.rate.search);
  app.get('/cinema/rates/comment/search', ctx.comment.search);
  app.post('/cinema/rates/comment/search', ctx.comment.search);
  app.get('/cinema/rates/:id/:author', ctx.rate.load);
  app.post('/cinema/rates/useful/:id/:author/:userId', ctx.rate.setUseful);
  app.delete('/cinema/rates/useful/:id/:author/:userId', ctx.rate.removeUseful);
  app.post('/cinema/rates/comment/:id/:author/:userId', ctx.rate.comment);
  app.delete('/cinema/rates/comment/:commentId/:author', ctx.rate.removeComment);
  app.put('/cinema/rates/comment/:commentId/:id/:author/:userId', ctx.rate.updateComment);

  app.get('/films/rates/search', ctx.rateFilm.search);
  app.post('/films/rates/search', ctx.rateFilm.search);
  app.get('/films/rates/comment/search', ctx.commentFilm.search);
  app.post('/films/rates/comment/search', ctx.commentFilm.search);
  app.post('/films/rates/:id/:author', ctx.rateFilm.rate);
  app.post('/films/rates/useful/:id/:author/:userId', ctx.rateFilm.setUseful);
  app.delete('/films/rates/useful/:id/:author/:userId', ctx.rateFilm.removeUseful);
  app.post('/films/rates/comment/:id/:author/:userId', ctx.rateFilm.comment);
  app.put('/films/rates/comment/:commentId/:id/:author/:userId', ctx.rateFilm.updateComment);
  app.delete('/films/rates/comment/:commentId/:author', ctx.rateFilm.removeComment);

  app.get('/cinema/search', ctx.cinema.search);
  app.post('/cinema/search', ctx.cinema.search);
  app.get('/cinema', ctx.cinema.all);
  app.post('/cinema', checkCinema, ctx.cinema.create);

  app.get('/cinema/:id', ctx.cinema.load);
  app.put('/cinema/:id', checkCinema, ctx.cinema.update);
  app.patch('/cinema/:id', checkCinema, ctx.cinema.patch);
  app.delete('/cinema/:id', checkCinema, ctx.cinema.delete);

  //criteria
  app.post('/cinema/rate-criteria/search', ctx.rateCriteria.search);
  app.post('/cinema/rate-criteria/search/:id/:author', ctx.rateCriteria.search);
  app.post('/cinema/rate-criteria/:id/:author', ctx.rateCriteria.getRate);
  app.post('/cinema/rate-criteria/rate/:id/:author', ctx.rateCriteria.rate);
 
  app.post('/appreciation/search', ctx.appreciation.search);
  app.post('/appreciation/reply/search', ctx.comment.search);
  app.post('/appreciation', ctx.appreciation.create);
  app.post('/appreciation/:id/:author', ctx.appreciation.load);
  app.put('/appreciation/:id/:author', ctx.appreciation.update);
  app.patch('/appreciation/:id/:author', ctx.appreciation.patch);
  app.post('/appreciation/reply/:id/:author/:userid', ctx.appreciation.reply);
  app.delete('/appreciation/reply/:id/:author/:userid', ctx.appreciation.removeReply);
  app.put('/appreciation/reply/:id/:author/:userid', ctx.appreciation.updateReply);

  app.get('/uploads', ctx.uploads.all);
  app.get('/uploads/:id', ctx.uploads.load);
  app.post('/uploads', parser.single('file'), ctx.uploads.upload);
  app.post('/uploads/youtube', ctx.uploads.insertData);
  app.delete('/uploads', ctx.uploads.remove);
  app.delete('/uploads/youtube', ctx.uploads.deleteData);
}
