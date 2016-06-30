import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CatProvider} from '../../providers/cat-provider/cat-provider';
import {CatPage} from '../cat/cat';

@Component({
  providers:[CatProvider],
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  public cats:Array<Object>;

  constructor(private navController: NavController, public catProvider:CatProvider) {


    this.catProvider.load().subscribe(result => {
        console.log('result is '+JSON.stringify(result));
        this.cats = result;
    });

  }

  selectCat(cat) {
    console.log('clicked',cat);
    this.navController.push(CatPage, {id:cat.id});
  }

}
