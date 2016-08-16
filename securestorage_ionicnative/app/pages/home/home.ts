import {Component} from '@angular/core';
import {NavController,Platform} from 'ionic-angular';
import {LoginProvider} from '../../providers/login-provider/login-provider';
import { Dialogs } from 'ionic-native';
import {MainPage} from '../main-page/main-page';
import {SecureStorage} from 'ionic-native';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers:[LoginProvider]
})
export class HomePage {

  public username:string;
  public password:string;
  private loginService:LoginProvider;
  public readyToLogin:boolean;
  private secureStorage:SecureStorage;

  constructor(public navCtrl: NavController, platform:Platform ) {
    console.log('hello world');
    this.loginService = new LoginProvider();
    this.readyToLogin = false;

    platform.ready().then(() => {

      this.secureStorage = new SecureStorage();
      this.secureStorage.create('demoapp').then(
        () => {
          console.log('Storage is ready!');

          this.secureStorage.get('loginInfo')
          .then(
            data => {
              console.log('data was '+data);
              let {u,p} = JSON.parse(data);
              this.username = u;
              this.password = p;
              this.login();
            },
            error => {
              // do nothing - it just means it doesn't exist
            }
          );

          this.readyToLogin = true;
        },
        error => console.log(error)
      );

    });

  }

  login() {

    console.log('login',this.username,this.password);
    this.loginService.login(this.username,this.password).subscribe((res) => {

      console.log(res);

      if(res.success) {

        //securely store
        this.secureStorage.set('loginInfo', JSON.stringify({u:this.username, p:this.password}))
        .then(
        data => {
          console.log('stored info');
        },
        error => console.log(error)
        );

        //thx mike for hack to remove back btn
        this.navCtrl.setRoot(MainPage, null, {
          animate: true
        });

      } else {
        Dialogs.alert('Bad login. Use \'password\' for password.','Bad Login','Ok');
        this.secureStorage.remove('loginInfo');
      }

    });

  }

}
