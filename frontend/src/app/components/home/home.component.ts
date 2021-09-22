import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/services/service-interfaces';
import { CampaignService } from 'src/app/services/campaign.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  constructor(public campaignService: CampaignService) {}

  get allCampaignData(){
    return this.campaignService.allCampaignData
  }
}
