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

  dtFormat(d) {
    if(Intl) {
      return new Intl.DateTimeFormat().format(d) + ' ' + new Intl.DateTimeFormat(navigator.language, {hour:'numeric',minute:'2-digit'}).format(d);
    } else {
      return d;
    }
  }

  constructor(public navCtrl: NavController, public catProvider:CatProvider) {
    catProvider.load().subscribe((catData:any) => {

      catData.lastRating = this.dtFormat(catData["lastRating"]);
      this.cats.push(catData);

    });
  }

  loadCat(cat) {
    this.navCtrl.push(DetailPage, {selectedCat:cat});
  }

}
