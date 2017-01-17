import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { MainPage } from '../pages/main/main';

import { HomePage } from '../pages/home/home';
import { CatsPage } from '../pages/cats/cats';
import { DogsPage } from '../pages/dogs/dogs';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MainPage,
    CatsPage,
    DogsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MainPage,
    CatsPage,
    DogsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
