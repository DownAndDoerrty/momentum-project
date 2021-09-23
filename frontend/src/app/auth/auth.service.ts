import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL: string = 'http://localhost:4000/login/'
  redirectUrl = '/login';
  isLoggedIn = false;

  constructor(
    public router: Router,
    private http: HttpClient
    ) {
    this.submitLoginCredentials().subscribe((res: HttpResponse<any>) => {
      localStorage.setItem('authorization', res.body?.token)
    })
    this.isLoggedIn = !!localStorage.getItem('authorization')
    console.log(this.isLoggedIn)
  }


  submitLoginCredentials() {
    return this.http.post(
      this.baseURL,
      { email: "harry@harry.com" },
      { headers: {
        responseType: "json",
      },
      observe: 'response'
     }
    )
  }

  login() {
    !!this.isLoggedIn ? this.router.navigate(['/home']) : console.log("You need to login!")
  }

  logout() {
    !this.isLoggedIn ? this.router.navigate(['/login']) : console.log("You've logged out!")
    localStorage.clear()
  }
}
