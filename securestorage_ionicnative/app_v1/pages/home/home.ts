import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {LoginProvider} from '../../providers/login-provider/login-provider';
import { Dialogs } from 'ionic-native';
import {MainPage} from '../main-page/main-page';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers:[LoginProvider]
})
export class HomePage {

  public username:string;
  public password:string;
  private loginService:LoginProvider;
  
  constructor(public navCtrl: NavController) {
    this.loginService = new LoginProvider();
  }

  login() {

    console.log('login',this.username,this.password);
    this.loginService.login(this.username,this.password).subscribe((res) => {

      console.log(res);

      if(res.success) {
        
        //thx mike for hack to remove back btn
        this.navCtrl.setRoot(MainPage, null, {
          animate: true
        });

      } else {
        Dialogs.alert("Bad login. Use 'password' for password.","Bad Login");
      }

    });

  }

}
