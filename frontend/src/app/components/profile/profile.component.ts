import { User } from './../../services/service-interfaces';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/services/campaign.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass'],
})
export class ProfileComponent implements OnInit {
  userProfile?: User;

  constructor(
    public userService: UserService,
    public campaignService: CampaignService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  newCampaignForm = this.formBuilder.group({
    campaignName: ['', Validators.required],
    campaignDescription: ['', Validators.required],
    campaignPictureURL: ['', Validators.required],
  });

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
      });
  }

  submitNewCampaignForm() {
    this.campaignService
      .createNewCampaign(this.userProfile.id, this.newCampaignForm.value)
      .subscribe(({ data }: any) => {
        this.userProfile.ownedCampaigns = [
          ...this.userProfile.ownedCampaigns,
          data.createCampaign,
        ];
      });
  }
}
