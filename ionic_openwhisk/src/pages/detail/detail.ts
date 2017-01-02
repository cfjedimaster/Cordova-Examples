import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CatProvider } from '../../providers/cat-provider';
import { InAppBrowser } from 'ionic-native';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
  providers: [ CatProvider ]
})
export class DetailPage {

  public cat:any = {url:'',id:'',source_url:''};

  constructor(public navCtrl: NavController, public navParams: NavParams, public catProvider:CatProvider) {
    catProvider.get(navParams.get('id')).subscribe(data => {
      console.log('data is '+JSON.stringify(data));
      this.cat = data;
    });
    
  }

  loadSource(u) {
    new InAppBrowser(u,'_system');
  }

}
