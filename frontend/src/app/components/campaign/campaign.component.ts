import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/services/campaign.service';
import { Campaign } from 'src/app/services/service-interfaces';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.sass']
})
export class CampaignComponent implements OnInit {



  constructor(public campaignService: CampaignService, private route: ActivatedRoute) { }
  campaign?: Campaign;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.campaignByCampaignId(parseInt(params['campaignId']));
    })
  }

  campaignByCampaignId(campaignId: number) {
    this.campaignService.loadSingleCampaignDataFromGraphQL(campaignId).subscribe(({data}: any) => {
      this.campaign = data?.getCampaignByCampaignId;
      console.log('this.campaign', this.campaign);
    })
  }
}
