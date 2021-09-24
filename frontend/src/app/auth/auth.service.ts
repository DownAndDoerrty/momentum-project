import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string = 'http://localhost:4000/login/'
  redirectUrl = '/login';

  get isLoggedIn() {
    return !!localStorage.getItem('authorization')
  }

  constructor(
    public router: Router,
    private http: HttpClient
    ) {
    console.log(this.isLoggedIn)
  }


  submitLoginCredentials(email: string) {
    const observableResponse = this.http.post(
      this.baseURL,
      { email: email },
      { headers: {
        responseType: "json",
      },
      observe: 'response'
     }
    );
    observableResponse.subscribe((res: HttpResponse<any>) => {
      localStorage.setItem('authorization', res.body?.token)
    });
    return observableResponse;
  }

  login() {
    if (this.isLoggedIn ) {
      this.router.navigate(['/home'])
    }
  }

  logout() {
    localStorage.clear()
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'])
    }
  }
}
