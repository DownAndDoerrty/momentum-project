import { UserService } from 'src/app/services/user.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {
  @Input() userProfileId: number;
  userProfile?: any;

  constructor(public userService: UserService) {}

  ngOnInit() {
    this.userProfileByUserId(this.userProfileId)
  }

  userProfileByUserId(userId: number) {
    this.userProfile = this.userService.loadSingleUserDataFromGraphQL(userId).subscribe(({data}: any) => {
      this.userProfile = data?.getUserByUserId
      console.log(this.userProfile)
    })
  }

}
