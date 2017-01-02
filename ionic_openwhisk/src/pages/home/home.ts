import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CatProvider } from '../../providers/cat-provider';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ CatProvider ]
})
export class HomePage {

  cats:any[] = [];

  constructor(public navCtrl: NavController, public catProvider:CatProvider) {
    catProvider.list().subscribe(data => {
      console.log('data is '+JSON.stringify(data));
      data.forEach((cat) => {
        this.cats.push(cat);
      });
    });
  }

  showCat(cat) {
    this.navCtrl.push(DetailPage, {id:cat.id});
  }

}
