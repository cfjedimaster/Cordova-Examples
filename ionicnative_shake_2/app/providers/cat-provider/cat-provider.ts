import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the CatProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CatProvider {
  data: any;

  constructor() {
    // hard coded initial data
    this.data = [];
    
    for(var i=0;i<3;i++) {
      this.data.push(this.makeCat());
    }
  }

  makeCat() {
    return {
      "name":"Cat "+(this.data.length+1),
      "id":+(this.data.length+1)
    }
  }

  load() {
      //add a cat
      this.data.push(this.makeCat());
      return Promise.resolve(this.data);
  }

}

