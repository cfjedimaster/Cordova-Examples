import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

/*
  Generated class for the Data provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Data {

 public cats:Array<Object> = [
   {name:'Luna', lastRating:new Date(2016, 11, 2 ,9, 30), numRatings:338324, avgRating:3.142},
   {name:'Pig', lastRating:new Date(2016, 11, 12, 16,57), numRatings:9128271, avgRating:4.842},
   {name:'Cracker', lastRating:new Date(2016, 10, 29, 13, 1), numRatings:190129, avgRating:2.734},
   {name:'Robin', lastRating:new Date(2016, 11, 19, 5, 42), numRatings:642850, avgRating:4.1},
   {name:'Simba', lastRating:new Date(2016, 11, 18, 18, 18), numRatings:80213, avgRating:1.9999}
   ];


  constructor() {
  }

  load() {
    return Observable.from(this.cats).delay(2000);
  }



}
