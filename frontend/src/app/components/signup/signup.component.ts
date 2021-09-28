import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  signupForm = this.formBuilder.group({
    firstName: '',
    // ['', Validators.required],
    lastName: '',
    // ['', Validators.required],
    email: '',
    // ['', Validators.required],
    password: '',
    // ['', Validators.required],
    profilePictureURL: '',
    // ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/home']);
    }
  }

  submitSignupForm() {
    this.authService.createUser({
      firstName: this.signupForm.value.firstName,
      lastName: this.signupForm.value.lastName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      profilePictureURL: this.signupForm.value.profilePictureURL,
    });
    this.signupForm.reset();
  }
}
