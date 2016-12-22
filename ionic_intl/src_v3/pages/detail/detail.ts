import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the DetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {

  public cat:Object;

  numberFormat(d) {
    if(Intl) {
      return new Intl.NumberFormat().format(d);
    } else {
      return d;
    }
  }

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    navParams.data.selectedCat.numRatings = this.numberFormat(navParams.data.selectedCat.numRatings);
    navParams.data.selectedCat.avgRating = this.numberFormat(navParams.data.selectedCat.avgRating);
    this.cat = navParams.data.selectedCat;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
