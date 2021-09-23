import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
    const authToken = `Bearer ${localStorage.getItem('authorization')}`;

    let authorizedRequest = request;
    if (!authorizedRequest.headers.has('authorization')) {
      authorizedRequest = request.clone({
        headers: request.headers.set('authorization', authToken)
      })
    }

    return next.handle(authorizedRequest);
  }
}
