import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Data } from '../../providers/data';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[Data]
})
export class HomePage {

  public cats:Array<Object> = [];

  constructor(public navCtrl: NavController, public dataProvider:Data, public loadingCtrl:LoadingController) {

    let loader = this.loadingCtrl.create({content:'Loading Data'});
    loader.present();

    dataProvider.load().subscribe( (c) => {
      this.cats.push(c);
    }, error => console.log(error), 
      () => loader.dismiss()
    );
  }

}
