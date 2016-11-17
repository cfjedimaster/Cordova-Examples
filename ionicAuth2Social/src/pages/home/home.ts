import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { FacebookAuth, User, Auth } from '@ionic/cloud-angular';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  name:string;

  constructor(public navCtrl: NavController, public user:User, public facebookAuth:FacebookAuth, public auth:Auth) {
    console.log(user);
    /*
    find the name based on how they logged in
    */
    if(user.social && user.social.facebook) {
      this.name = user.social.facebook.data.full_name;
    } else if(user.social && user.social.twitter) {
      this.name = user.social.twitter.data.full_name;
    } else {
      this.name = "Friend";
    }
  }

  logout() {
    //switch based on social login, could be better
    if(this.user.social && this.user.social.facebook) {
      this.facebookAuth.logout();
    } else {
      this.auth.logout();
    }
    this.navCtrl.setRoot(LoginPage);
  }

}
