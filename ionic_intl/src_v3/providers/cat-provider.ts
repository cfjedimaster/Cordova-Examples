import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class CatProvider {

 public cats:Array<Object> = [
   {name:'Luna', lastRating:new Date(2016, 11, 2 ,9, 30), numRatings:338324, avgRating:3.142},
   {name:'Pig', lastRating:new Date(2016, 11, 12, 16,57), numRatings:9128271, avgRating:4.842},
   {name:'Cracker', lastRating:new Date(2016, 10, 29, 13, 1), numRatings:190129, avgRating:2.734},
   {name:'Robin', lastRating:new Date(2016, 11, 19, 5, 42), numRatings:642850, avgRating:4.1},
   {name:'Simba', lastRating:new Date(2016, 11, 18, 18, 18), numRatings:80213, avgRating:1.9999}
   ];


  constructor() {
    console.log('Hello CatProvider Provider');
  }

  load() {
    console.log('called load');
    return Observable.from(this.cats);
  }
}
