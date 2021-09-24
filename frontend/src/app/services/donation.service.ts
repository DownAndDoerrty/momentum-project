import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Donation } from './service-interfaces';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { donationFragment } from './query-fragments';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(public http: HttpClient) {}

  createNewDonation(
    newDonationData: Omit<
      Donation,
      'updatedAt' | 'createdAt' | 'id' | 'donor' | 'campaign'
    >
  ) {
    return this.http
      .post(
        environment.apiUrl,
        JSON.stringify({
          query: `
            mutation {
              createDonation (
                donorUserId: ${JSON.stringify(newDonationData.donorUserId)},
                campaignId: ${JSON.stringify(newDonationData.campaignId)},
                donationAmount: ${JSON.stringify(
                  newDonationData.donationAmount
                )},
                donationNote: ${JSON.stringify(newDonationData.donationNote)}
                ) {
                ${donationFragment}
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
}
