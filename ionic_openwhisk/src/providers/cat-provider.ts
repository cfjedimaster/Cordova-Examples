import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CatProvider {

  private LIST_URL = 'https://3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net/cats/list';

  private DETAIL_URL = 'https://3b1fd5b1-e8cc-4871-a7d8-cc599e3ef852-gws.api-gw.mybluemix.net/cats/detail';

  constructor(public http: Http) {
    console.log('Hello CatProvider Provider');
  }

  list() {

    return this.http.get(this.LIST_URL)
    .map(res => res.json())
    .map(data => data.response);

  }

  get(id) {
    return this.http.get(this.DETAIL_URL + '?id='+id)
    .map(res => res.json())
    .map(data => data.response);
  }

}
