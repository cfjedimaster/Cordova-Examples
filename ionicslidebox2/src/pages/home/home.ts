import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ImageSearch } from '../../providers/image-search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[ImageSearch]
})
export class HomePage {

  search:string;
  slides:any[];
  mySlideOptions = {
    pager:true
  };
  
  constructor(public navCtrl: NavController, public searchProvider:ImageSearch) {
  }

  doSearch() {
    console.log('searching for '+this.search);
    this.searchProvider.search(this.search).subscribe(data => {
      console.log(data);
      this.slides = data;
    });
  }

}
