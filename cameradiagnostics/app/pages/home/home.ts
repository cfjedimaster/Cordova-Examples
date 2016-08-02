import {Component} from '@angular/core';
import {NavController,Platform} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {CameraOptions} from 'ionic-native';
import {Diagnostic} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  public img:string;
  public cameraSupported:boolean;

  constructor(private navCtrl: NavController, platform:Platform) {
    this.img = '';
    platform.ready().then(() => {
     
      Diagnostic.isCameraPresent().then((res) => {
        console.log('diagnostic result', res);
        this.cameraSupported = res;
      }).catch((err) =>  {
        console.log('got an error using diagnostic');
        console.dir(err);
      });

    });
  }

  getPic(type:string) {

    let options:CameraOptions = {
      targetWidth:400,
      targetHeight:400
    }

    if(type === 'select') {
      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
    } else {
      options.sourceType = Camera.PictureSourceType.CAMERA;
    }

    Camera.getPicture(options).then((url) => {
      this.img = url;
    });

  }

}
