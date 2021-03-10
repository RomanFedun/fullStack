import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
// import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/MaterialService";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form: FormGroup | any

  uSub: any

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required, Validators.email
      ]),
      password: new FormControl('', [
        Validators.required, Validators.minLength(4)
      ])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params.registered) {
        MaterialService.toast('well come')
      } else  if (params.accessDenied) {
      //  you should to authorized
        MaterialService.toast('you should to authorized')
      } else if (params.sessionFailed) {
        MaterialService.toast('please, authorized again')
      }
    })
  }

  ngOnDestroy() {
    if (this.uSub) {
      this.uSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()

    this.uSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      error => {
        if (error.error.message) {
          MaterialService.toast(error.error.message)
          console.warn(error)
          this.form.enable()
        } else {
          this.form.enable()
          MaterialService.toast('Internet disconnect')
        }
      }
    )
  }

}
