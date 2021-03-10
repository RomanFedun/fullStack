import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {MaterialService} from "../shared/classes/MaterialService";

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form: FormGroup | any
  aSub: any

  constructor(private auth: AuthService,
              private router: Router ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required, Validators.email
      ]),
      password: new FormControl('', [
        Validators.required, Validators.minLength(4)
      ])
    })

  }

  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {registered: true}
        })
        MaterialService.toast('user created successfully')
      },
        error => {
          MaterialService.toast(error.error.message)
          console.warn(error)
          this.form.enable()
        }
    )
  }
}
