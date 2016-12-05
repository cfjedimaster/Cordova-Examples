import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { Contact, Contacts, ContactField } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public alertCtrl:AlertController, public loadingCtrl:LoadingController) {
    
  }

  getRandomInt (min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  randomCat() {
    let w = this.getRandomInt(200,500);
    let h = this.getRandomInt(200,500);
    return `https://placekitten.com/${w}/${h}`;
  }

  //Credit: http://stackoverflow.com/a/20285053/52160
  toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
      callback(reader.result);
    }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
  }

  fixContacts() {

    let loader = this.loadingCtrl.create({
      content: "Doing important work...",
    });
    loader.present();


    let fixed = 0;
    let proms = [];

    Contacts.find(["name"]).then((res) => {

      res.forEach( (contact:Contact) => {

        if(!contact.photos) {
          console.log('FIXING '+contact.name.formatted);
          //console.log(contact);

          proms.push(new Promise( (resolve, reject) => {

            
            this.toDataUrl(this.randomCat(), function(s) {

              var f = new ContactField('base64',s,true);

              contact.photos = [];
              contact.photos.push(f);
              console.log('FIXED '+contact.name.formatted);
              contact.save();
              fixed++;
              resolve();
              
            });
            
          }));
        }

      });

      Promise.all(proms).then( (res) => {
        
        loader.dismissAll();

        console.log('all done, fixed is  '+fixed);
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

    });
  
  }

}
