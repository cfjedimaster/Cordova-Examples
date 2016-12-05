import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Contact, Contacts, ContactField } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl:AlertController) {
    
  }

  getRandomInt (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  randomCat() {
    let w = this.getRandomInt(200,500);
    let h = this.getRandomInt(200,500);
    return `https://placekitten.com/${w}/${h}`;
  }

  fixContacts() {
    let fixed = 0;
    console.log('ok so wtf');
    Contacts.find(["name"]).then((res) => {
      //console.log(res);
      res.forEach( (contact:Contact) => {
        if(!contact.photos) {
          console.log('FIXING '+contact.name.formatted);
          console.log(contact);

          var f = new ContactField('url',this.randomCat(),true);

          contact.photos = [];
          contact.photos.push(f);
          contact.save();
          fixed++;
        }
   
      });

      let subTitle, button;

      if(fixed === 0) {
        subTitle = "Sorry, but every single one of your contacts had a picture. I did nothing.";
        button = "Sad Face";
      } else {
        subTitle = `I've updated ${fixed} contact(s). Enjoy!`;
        button = "Awesome";      
      }

      this.alertCtrl.create({
          title:'Contacts Updated',
          subTitle:subTitle,
          buttons:[button]
      }).present();

    });

  }

}
