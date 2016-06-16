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
  key: string = 'e4564fca8b58ae55866491bf6ceec485';

  constructor(public http: Http) {
    this.http = http;
  }

  load(latitude:String,longitude:String) {

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      /*
      var latitude:String = '30.2238889';
      var longitude:String = '-92.0197222';
      */

      //console.log('about to get weather','https://api.forecast.io/forecast/'+this.key+'/'+latitude+','+longitude); 

      
      this.http.get('https://api.forecast.io/forecast/'+this.key+'/'+latitude+','+longitude+'?exclude=alerts,minutely,hourly')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          resolve(data);
        });
        
    });
  }
}

