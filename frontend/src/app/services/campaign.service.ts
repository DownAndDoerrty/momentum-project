import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Campaign } from './service-interfaces';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { donationFragment, userFragment } from './query-fragments';

const campaignQuery = `
    id
    campaignOwnerId
    campaignName
    campaignDescription
    campaignPictureURL
    createdAt
    updatedAt
    donations {
      ${donationFragment}
      donor {
        ${userFragment}
      }
    }
    campaignOwner {
      ${userFragment}
    }
  `;
@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  allCampaignData: Campaign[] = [];

  constructor(public http: HttpClient) {
    this.load();
  }

  loadAllCampaignsFromGraphQl() {
    return this.http
      .post(
        environment.apiUrl,
        JSON.stringify({
          query: `
        query {
          getAllCampaigns {
              ${campaignQuery}
          }
        }
        `,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(catchError(this.handleError));
  }

  loadSingleCampaignDataFromGraphQL(campaignId: number) {
    return this.http
      .post(
        environment.apiUrl,
        JSON.stringify({
          query: `
        query {
          getCampaignByCampaignId (campaignId: ${JSON.stringify(campaignId)}) {
            ${campaignQuery}
          }
        }
        `,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(catchError(this.handleError));
  }

  createNewCampaign(
    campaignOwnerId: number,
    newCampaignData: Omit<
      Campaign,
      'updatedAt' | 'createdAt' | 'id' | 'campaignOwnerId'
    >
  ) {
    return this.http
      .post(
        environment.apiUrl,
        JSON.stringify({
          query: `
            mutation {
              createCampaign (
                  campaignOwnerId: ${JSON.stringify(campaignOwnerId)},
                  campaignName: ${JSON.stringify(newCampaignData.campaignName)},
                  campaignDescription: ${JSON.stringify(
                    newCampaignData.campaignDescription
                  )},
                  campaignPictureURL: ${JSON.stringify(
                    newCampaignData.campaignPictureURL
                  )},
                ) {
                ${campaignQuery}
              }
            }
          `,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError('Something bad happened; please try again later.');
  }

  load() {
    this.loadAllCampaignsFromGraphQl().subscribe(({ data }: any) => {
      this.allCampaignData = data?.getAllCampaigns;
    });
  }
}
