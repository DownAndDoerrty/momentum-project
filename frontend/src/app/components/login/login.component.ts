import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
    ) { }

    loginForm = this.formBuilder.group({
      email: ''
    })

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/home'])
    }
  }

  onLoginSubmit() {
    console.log(this.loginForm.value);
    this.authService.submitLoginCredentials(this.loginForm.value.email).subscribe((item: HttpResponse<any>) => {
      if (item.body.token) {
        this.authService.login()
      }
    });
    this.loginForm.reset();
  }

}