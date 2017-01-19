import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Auth, User } from '@ionic/cloud-angular';
import { LoginPage } from '../login/login';
import { Database } from '@ionic/cloud-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public chats: Array<string>;
  public message:string = '';

  constructor(public navCtrl: NavController, public user:User, public auth:Auth, public db:Database) {
    console.log(user);

    this.db.collection('chats').findAll({creator:this.user.id}).order('created','descending').watch().subscribe( (chats) => {
      console.dir(chats);
      this.chats = chats;
    }, (error) => {
      console.error(error);
    });

  }

  sendMessage() {
    this.db.collection('chats').store({text:this.message, 
      created:Date.now(), creator:this.user.id}).subscribe(null, (e) => {
        console.log('oh shit');
        console.log(e);
      }, null);
  }

  logout() {
    this.auth.logout();
    this.navCtrl.setRoot(LoginPage);
  }

}
