import { Component, Input, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from 'src/app/services/campaign.service';
import { DonationService } from 'src/app/services/donation.service';
import { Campaign } from 'src/app/services/service-interfaces';
import { FormBuilder } from '@angular/forms';
import { Donation } from 'src/app/services/service-interfaces';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss'],
})
export class CampaignComponent implements OnInit {
  constructor(
    public campaignService: CampaignService,
    public donationService: DonationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}
  campaign?: Campaign;

  donationForm = this.formBuilder.group({
    donationAmount: '',
    donationNote: '',
  });

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.campaignByCampaignId(parseInt(params['campaignId']));
    });
  }

  campaignByCampaignId(campaignId: number) {
    this.campaignService
      .loadSingleCampaignDataFromGraphQL(campaignId)
      .subscribe(({ data }: any) => {
        this.campaign = data?.getCampaignByCampaignId;
      });
  }
  onDonationSubmit() {
    console.log('Donation Amount: ' + this.donationForm.value.donationAmount);
    this.donationService
      .createNewDonation({
        donorUserId: 1,
        campaignId: this.campaign?.id,
        donationAmount: +this.donationForm.value.donationAmount,
        donationNote: this.donationForm.value.donationNote,
      })
      .subscribe(({ data }: any) => {
        console.log(data);
      });
  }
}
