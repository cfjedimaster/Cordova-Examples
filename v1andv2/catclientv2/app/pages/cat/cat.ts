import { Component } from '@angular/core';
import { NavController,NavParams } from 'ionic-angular';
import {CatProvider} from '../../providers/cat-provider/cat-provider';

@Component({
  providers:[CatProvider],
  templateUrl: 'build/pages/cat/cat.html',
})
export class CatPage {

  public cat:Object = {name:""};

  constructor(private nav: NavController, private params:NavParams, public catProvider:CatProvider) {
    this.catProvider.get(params.data.id).subscribe(result => {
        console.log('result for cat  is '+JSON.stringify(result));
        this.cat = result;
    });
  
}

}
