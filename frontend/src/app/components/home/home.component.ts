import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/service-interfaces';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  constructor(public userService: UserService) {}

  get allUserData(){
    return this.userService.allUserData
  }
}
