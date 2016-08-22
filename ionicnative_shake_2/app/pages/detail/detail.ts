import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the DetailPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/detail/detail.html',
})
export class DetailPage {

  public cat:any = {name:''};

  constructor(private nav: NavController,private np:NavParams) {
    this.cat = np.get('cat');
    console.log(this.cat);
  }

}
