import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Database } from '@ionic/cloud-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public chats: Array<string>;
  public message:string = '';

  constructor(public navCtrl: NavController, public db:Database) {
    this.db.connect();
    this.db.collection('chats').order('created','descending').watch().subscribe( (chats) => {
      console.dir(chats);
      this.chats = chats;
    }, (error) => {
      console.error(error);
    });

  }

  sendMessage() {
    this.db.collection('chats').store({text:this.message, created:Date.now()});
  }

}
