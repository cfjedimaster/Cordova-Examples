import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User, FacebookAuth, Auth } from '@ionic/cloud-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, public user: User, public facebookAuth:FacebookAuth, public auth:Auth) {}

  doFacebook() {
    console.log('do FB');
    this.facebookAuth.login().then(() => {
      this.navCtrl.setRoot(HomePage);
    });
  }

  doTwitter() {
    console.log('do Twitter');
    this.auth.login('twitter').then(() => {
      this.navCtrl.setRoot(HomePage);
    });
  }

}
