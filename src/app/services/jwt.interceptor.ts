import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from './localstorage.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  constructor(private localStorageService: LocalStorageService) {}


  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.localStorageService.getToken()

    const isAPIUrl = httpRequest.url.startsWith(environment.apiURL)

    if(token && isAPIUrl) {
      httpRequest = httpRequest.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    }
    return next.handle(httpRequest);
  }
}
