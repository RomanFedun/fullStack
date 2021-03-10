import {Injectable} from "@angular/core";
import {User} from "../interfaces";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {MaterialService} from "../classes/MaterialService";

@Injectable(
  {providedIn: "root"}
)
export class AuthService {

  private token = ''
  // public netChecker = true

  constructor(private http: HttpClient) {
  }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user)
  }

  login(user: User): Observable<{token: string}> {

      return  this.http.post<{ token: string }>('/api/auth/login', user)
        .pipe(
          tap(
            ({token}) => {
              localStorage.setItem('auth.token', token)
              this.setToken(token)
            }
          )
        )



  }

  setToken(token: any) {
    this.token = token
  }

  getToken(): any {
    return this.token
  }

  logout() {
    this.setToken(null)
    localStorage.clear()
  }

  IsAuthenticate() {
    if (this.token) {
      return true
    } else {
      return false
    }
  }
 }
