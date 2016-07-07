import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CatProvider} from '../../providers/cat-provider/cat-provider';

@Component({
  providers: [CatProvider],
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  public cats:Array<Object>;

  constructor(public catProvider:CatProvider, private navController: NavController) {
    this.loadCats();
  }

  loadMore() {
    console.log('load more cats');
    this.loadCats();
  }

  loadCats() {
    this.catProvider.load().then(result => {
      console.log('eh?');
      this.cats = result;
    });
  }

}
