import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate, CanActivateChild{

  constructor(private auth: AuthService,
              private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (this.auth.IsAuthenticate()) {
      return of(true) //<of> return true in <Observable>
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          accessDenied: true
        }
      })
      return of(false)
    }
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.canActivate(route, state)
  }
}
