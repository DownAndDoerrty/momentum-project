import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Campaign } from './service-interfaces';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  allCampaignData: Campaign[] = []

  constructor(public http: HttpClient) {
    this.load()
  }

  loadAllCampaignsFromGraphQl() {
    return this.http.post(
      environment.apiUrl,
      JSON.stringify({
        query: `
        query {
          getAllCampaigns {
            id
            campaignOwnerId
            campaignName
            campaignDescription
            campaignPictureURL
            createdAt
            updatedAt
            donations{
              donor {
                firstName
                id
              }
              donationAmount
            }
          }
        }
        `,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    ).pipe(catchError(this.handleError));
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
      console.log(data)
      this.allCampaignData = data?.getAllCampaigns
      console.log(this.allCampaignData)
    })
  }
}
