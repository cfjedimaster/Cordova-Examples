import {Page,NavController} from 'ionic/ionic';
import {RssService} from '../../providers/rss-service/rss-service';
import {DetailPage} from '../detail-page/detail-page';

@Page({
  templateUrl: 'build/pages/home/home.html',
  providers:[RssService]
})
export class HomePage {
  constructor(public rssService:RssService, nav:NavController) {
	  this.nav = nav;
	  
	  this.entries = [];

	  this.rssService.load().subscribe(
		  data => {
			  this.entries = data;
		  }
	  );

  }
  
  openPage(entry) {
	  console.log('open page called with '+entry.title);
	  this.nav.push(DetailPage, {selectedEntry:entry});
  }

}
