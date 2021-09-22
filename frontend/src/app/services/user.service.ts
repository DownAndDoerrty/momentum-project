import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { User } from './service-interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  allUserData: User[] = []

  constructor(public http: HttpClient) {
    this.load()
  }

  loadAllUserDataFromGraphQL() {
    return this.http.post(
      environment.apiUrl,
      JSON.stringify({
        query: `
        query {
          getAllUsers {
            id
            firstName
            lastName
            email
            passwordHash
            profilePictureURL
            createdAt
            updatedAt
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
    this.loadAllUserDataFromGraphQL().subscribe(({ data }: any) => {
      console.log(data)
      this.allUserData = data?.getAllUsers
      console.log(this.allUserData)
    })
  }
}
