import { DB, Repository } from 'query-core';
import { UsefulFilm, UsefulFilmModel, UsefulFilmRepository } from './film';

export class SqlFilmUsefulRepositoy extends Repository<UsefulFilm, string> implements UsefulFilmRepository {
  constructor(db: DB) {
    super(db, 'usefulfilm', UsefulFilmModel);
  }

  async deleteUseful(id: string, author: string, ctx?: any): Promise<boolean> {
    try {
      const query = 'delete from usefulfilm where id = $1 and author = $2';
      const rs = await this.exec(query, [id, author]);
      return rs > 0;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async searchUseful(obj: UsefulFilm): Promise<UsefulFilm | null> {
    try {
      const query = 'select * from usefulfilm  where id = $1 and author = $2';
      const rs = await this.query(query, [obj.id, obj.author]);
      if (rs[0]) {
        const result: UsefulFilm = rs[0] as UsefulFilm;
        return result;

      }
      return null;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
