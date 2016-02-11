import {Page,NavController,NavParams} from 'ionic/ionic';

@Page({
  templateUrl: 'build/pages/detail-page/detail-page.html'
})
export class DetailPage {
	constructor(nav: NavController,navParams:NavParams) {
		console.log('run');
		this.nav = nav;
		this.entry = navParams.get('selectedEntry');
		console.log('my entry is '+this.entry.title);
	}
}
