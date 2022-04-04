import { Controller, handleError, Log, queryParam } from "express-ext";
import { Film, FilmFilter, FilmService } from "./film";
import { Request, Response } from "express";
export class FilmController extends Controller<Film, string, FilmFilter>{
  constructor(log: Log, private filmService: FilmService) {
    super(log, filmService);
    this.array= ["status"];
    this.all = this.all.bind(this);

  }
  all(req: Request, res: Response) {
    if (this.filmService.all) {
      this.filmService.all()
        .then(films => res.status(200).json(films)).catch(err => handleError(err, res, this.log));
    }
  }
  
}
