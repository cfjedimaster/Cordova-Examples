import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';

/*
  Generated class for the RssService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

//Credit for latest version is @abdella from the Ionic Slack
@Injectable()
export class RssService {

	url = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22http%3A%2F%2Ffeeds.feedburner.com%2Fraymondcamdensblog%3Fformat%3Dxml%22&format=json&diagnostics=true&callback=';
	
	constructor(http: Http) {
		this.http = http;
	}
	
	load() {
 
		return this.http.get(this.url)
  			.map(res => res.json())
  			.map(data => data.query.results.item);
		  
	  /* v2
	  return Observable.create(s => {

		this.http.get('https://query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22http%3A%2F%2Ffeeds.feedburner.com%2Fraymondcamdensblog%3Fformat%3Dxml%22&format=json&diagnostics=true&callback=').subscribe(res => {
			console.log('in sub');
			console.dir(s);
			var result = res.json().query.results.item;
			result.forEach(i=>s.next(i));
			s.complete();
			
		});

	  });
	*/	

	// Static version	  
	//	  let data = [{title:"do one"},{title:"do two"},{title:"three"}];
	//	  return Observable.from(data);

	
  }
}

