import { UserService } from './services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor(public userService: UserService) {

  }

  // ngOnInit() {
    // this.userService
  // }
  title = 'tax-breaker';
}
