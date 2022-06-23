import { DB, Repository } from "query-core";
import { FilmRate, filmRateModel, FilmRateRepository } from "./film";

export class SqlFilmRateRepositoy extends Repository<FilmRate, string> implements FilmRateRepository{
  constructor(db:DB){
    super(db, 'filmRate', filmRateModel); 
  }

}