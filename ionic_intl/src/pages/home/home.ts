import { Component } from '@angular/core';
import { CatProvider } from '../../providers/cat-provider';
import { NavController } from 'ionic-angular';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[CatProvider]
})
export class HomePage {

 public cats:Array<Object> = [];


  constructor(public navCtrl: NavController, public catProvider:CatProvider) {
    catProvider.load().subscribe((catData) => {
      this.cats.push(catData);
    });
  }

  loadCat(cat) {
    this.navCtrl.push(DetailPage, {selectedCat:cat});
  }

}
