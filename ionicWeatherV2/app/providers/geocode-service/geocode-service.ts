import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeocodeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeocodeService {
  data: any = null;
  key:String = 'AIzaSyDAA-PApehssTB8B-tFfMz0gWH-Br2ARvI';
  
  constructor(public http: Http) {}

  locate(address) {
	if (this.data) {
	  // already loaded data
	  return Promise.resolve(this.data);
	}

	// don't have the data yet
	return new Promise(resolve => {
	  // We're using Angular Http provider to request the data,
	  // then on the response it'll map the JSON data to a parsed JS object.
	  // Next we process the data and resolve the promise with the new data.
	  this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+encodeURIComponent(address)+'&key='+this.key)
		.map(res => res.json())
		.subscribe(data => {
			// we've got back the raw data, now generate the core schedule data
			// and save the data for later reference
			if(data.status === "OK") {
				this.data = {name: data.results[0].formatted_address, location:{
					latitude: data.results[0].geometry.location.lat,
					longitude: data.results[0].geometry.location.lng
				}};
				resolve(this.data);
			} else {
				console.log(data);
				console.log('need to reject');
			}
		});
	});
  }
}

