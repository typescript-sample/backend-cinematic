import { DB, Repository } from "query-core";
import { FilmRate, filmRateModel, FilmRateRepository, FilmRateFilter } from "./film";

export class SqlFilmRateRepositoy extends Repository<FilmRate, string> implements FilmRateRepository{
  constructor(db:DB){
    super(db, 'filmRate', filmRateModel); 
  }

  async deleteFilmRate(id: string, author: string, ctx?: any): Promise<boolean> {
    try {
      const query = 'delete from filmrate where id = $1 and userid = $2';
      const rs = await this.exec(query, [id, author])
      return rs > 0;
    }
    catch (err) {
      console.log(err)
      return false;
    }
  }

  async searchFilmRate(obj: FilmRate): Promise<FilmRate | null>{
    try {
      const query = 'select * from filmrate  where id = $1 and userid = $2';
      const rs = await this.query(query, [obj.id, obj.userId])
      if(rs[0])
      {
        const result: FilmRate = rs[0] as FilmRate;
        return result
        
      }
      return null;
    }
    catch (err) {
      console.log(err)
      return null;
    }
  }

}