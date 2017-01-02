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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.cat = navParams.data.selectedCat;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
