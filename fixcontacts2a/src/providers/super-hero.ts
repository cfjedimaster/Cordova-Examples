import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SuperHero {

  apiUrl:string = 'https://3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net/api/getRandom';

  constructor(public http: Http) {
  }

  getSuperHero() {
    console.log('calling getSuperHero');
    return this.http.get(this.apiUrl + '?safaricanbiteme='+Math.random()).map(res => res.json());
  }

}
