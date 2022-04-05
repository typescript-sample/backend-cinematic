import { Controller, Log } from 'express-ext';
import { CinemaParent, CinemaParentFilter, CinemaParentService } from './cinema-parent';

export class CinemaParentController extends Controller<CinemaParent, string, CinemaParentFilter> {
  constructor(log: Log, userService: CinemaParentService) {
    super(log, userService);
  }
 
}
