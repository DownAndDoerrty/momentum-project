import { User } from './../../services/service-interfaces';
import { UserService } from 'src/app/services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  userProfile?: User;

  constructor(public userService: UserService, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.userProfileByUserId(parseInt(params['profileId']));
    });
  }

  userProfileByUserId(userId: number) {
    this.userService
      .loadSingleUserDataFromGraphQL(userId)
      .subscribe(({ data }: any) => {
        this.userProfile = data?.getUserByUserId;
        console.log('this.userProfile', this.userProfile);
      });
  }
}
