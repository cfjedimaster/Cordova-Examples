import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { ImageSearch } from '../../providers/image-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[ImageSearch]
})
export class HomePage {

  search:string;
  slides:any[];
  haveData:boolean = false;
  
  constructor(public navCtrl: NavController, public searchProvider:ImageSearch) {
  }

  doSearch() {
    console.log('searching for '+this.search);
    this.searchProvider.search(this.search).subscribe(data => {
      console.log(data);
      if(data.length >= 1) {
        this.haveData=true;
        this.slides = data;
      }
    });
  }

}
