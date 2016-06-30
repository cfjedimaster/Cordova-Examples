import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class CatProvider {

  constructor(private http: Http) {
  }

  get(id) {

    return this.http.get('http://localhost:3000/api/cats/'+id)
    .map(res => res.json())

  }

  load() {

    return this.http.get('http://localhost:3000/api/cats?filter[fields][color]=false&filter[fields][age]=false&filter[fields][friendly]=false')
    .map(res => res.json())

  }
}

