import {Component} from '@angular/core';
import {NavController,Platform} from 'ionic-angular';
import {CatProvider} from '../../providers/cat-provider/cat-provider';
import {DeviceMotion} from 'ionic-native';

@Component({
  providers: [CatProvider],
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {

  public cats:Array<Object>;
  private lastX:number;
  private lastY:number;
  private lastZ:number;
  private moveCounter:number = 0;

  constructor(public catProvider:CatProvider, private navController: NavController, platform:Platform) {
    this.loadCats();

    platform.ready().then(() => {
      var subscription = DeviceMotion.watchAcceleration({frequency:200}).subscribe(acc => {
        //console.log(acc);

        if(!this.lastX) {
          this.lastX = acc.x;
          this.lastY = acc.y;
          this.lastZ = acc.z;
          return;
        }

        let deltaX:number, deltaY:number, deltaZ:number;
        deltaX = Math.abs(acc.x-this.lastX);
        deltaY = Math.abs(acc.y-this.lastY);
        deltaZ = Math.abs(acc.z-this.lastZ);

        if(deltaX + deltaY + deltaZ > 3) {
          this.moveCounter++;
        } else {
          this.moveCounter = Math.max(0, --this.moveCounter);
        }

        if(this.moveCounter > 2) { 
          console.log('SHAKE');
          this.loadCats(); 
          this.moveCounter=0; 
        }

        this.lastX = acc.x;
        this.lastY = acc.y;
        this.lastZ = acc.z;

      });
    });

  }

  loadMore() {
    console.log('load more cats');
    this.loadCats();
  }

  loadCats() {
    this.catProvider.load().then(result => {
      this.cats = result;
    });
  }

}
