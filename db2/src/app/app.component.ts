import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { Auth, Database } from '@ionic/cloud-angular';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;

  constructor(platform: Platform, public auth:Auth, public db:Database) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if(this.auth.isAuthenticated()) {
        this.db.connect();
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
      
    });
  }
}
