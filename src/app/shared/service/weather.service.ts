import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest,} from '@angular/common/http';
import { ApiConfiguration } from '../api-configuration';
import { Observable as __Observable, throwError, from } from 'rxjs';
import { map as __map, filter as __filter, catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  appid = "appid=076c1a1abaf289eb198304252a1900e0"
  constructor(private http: HttpClient, protected config: ApiConfiguration, 
    ) {
   }
// Get weather details from server
   getWeatherDetails(req: any): __Observable<[]> {
    let api;
    console.log(req);
    if(req.state === 'Current'){
      api = `${this.config.current}${req.name}&${this.appid}`
    } else if(req.state === 'Hourly'){
      api = `${this.config.hourly}${req.name}&${this.appid}`
    }else if(req.state === '16 Days'){
      api = `${this.config.sixteenDays}${req.name}&cnt=IN&${this.appid}`
    }
    return this.http.get<[]>(api, {responseType: 'json'})
    .pipe(
      // retry(1),
      catchError(this.handleError)
    )
  }
   // Error handling 
  handleError(error) {
      let errorMessage = '';
      if(error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
  }
}
