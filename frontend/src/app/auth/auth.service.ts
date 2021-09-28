import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { share } from 'rxjs/operators';
import { User } from '../services/service-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseLoginURL: string = 'http://localhost:4000/login/';
  baseSignUpURL: string = 'http://localhost:4000/signup/';
  redirectUrl = '/login';
  currentUserEmail = '';

  get isLoggedIn() {
    return !!localStorage.getItem('authorization');
  }

  constructor(public router: Router, private http: HttpClient) {}

  submitLoginCredentials(email: string, password: string) {
    this.http
      .post(
        this.baseLoginURL,
        {
          email: email,
          password: password,
        },
        {
          headers: {
            responseType: 'json',
          },
          observe: 'response',
        }
      )
      .subscribe((res: HttpResponse<any>) => {
        localStorage.setItem('authorization', res.body?.token);
        if (res.body?.token) {
          this.currentUserEmail = email;
          this.login();
        }
      });
  }

  login() {
    if (this.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  logout() {
    localStorage.clear();
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  createUser(newUserData: Omit<User, 'updatedAt' | 'createdAt' | 'id'>) {
    const observableResponse = this.http
      .post(this.baseSignUpURL, newUserData, {
        headers: {
          responseType: 'json',
        },
        observe: 'response',
      })
      .pipe(share());
    observableResponse.subscribe((res: HttpResponse<any>) => {
      localStorage.setItem('authorization', res.body?.token);
      if (res.body?.token) {
        this.login();
      }
    });
    return observableResponse;
  }
}
