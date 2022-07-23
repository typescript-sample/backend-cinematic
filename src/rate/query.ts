import { Statement } from './core';
import { RateFilter } from './rate';

export function buildQuery(s: RateFilter): Statement {
  let query = `select * from rates`;
  const where = [];
  const params = [];
  let i = 1;

  if (s.id && s.id.length > 0) {
    where.push(`id = $${i++}`);
    params.push(s.id);
  }
  if (s.author && s.author.length > 0) {
    where.push(`author = $${i++}`);
    params.push(s.author);
  }
  if (s.rate && s.rate > 0) {
    where.push(`rate = $${i++}`);
    params.push(s.rate);
  }
  if (s.time && s.time) {
    where.push(`time = $${i++}`);
    params.push(s.time);
  }
  if (s.review && s.review) {
    where.push(`review ilike $${i++}`);
    params.push('%' + s.review + '%');
  }
  if (s.usefulCount && s.usefulCount) {
    where.push(`usefulCount >= $${i++}`);
    params.push(s.usefulCount);
  }
  if (where.length > 0) {
    query = query + ` where ` + where.join('and');
  }
  if (s.limit && s.limit > 0) {
    query = query + ` limit ${s.limit}`;
  }
  return { query, params };
}
