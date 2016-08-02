import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Camera} from 'ionic-native';
import {CameraOptions} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
  public img:String;

  constructor(private navCtrl: NavController) {
    this.img = "";
  }

  getPic(type:String) {

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
