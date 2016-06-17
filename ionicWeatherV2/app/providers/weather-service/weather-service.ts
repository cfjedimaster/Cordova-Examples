import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the WeatherService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WeatherService {
  key: string = 'change me';

  constructor(public http: Http) {
    this.http = http;
  }

  load(latitude:String,longitude:String) {

      return this.http.get('https://api.forecast.io/forecast/'+this.key+'/'+latitude+','+longitude+'?exclude=alerts,minutely,hourly')
        .map(res => res.json());
        
  }
}

