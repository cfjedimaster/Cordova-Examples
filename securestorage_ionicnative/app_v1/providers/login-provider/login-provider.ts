import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs';
//import 'rxjs/Observable/from';

@Injectable()
export class LoginProvider {

  constructor() {}

  public login(username:string,password:string) {
    let data = {success:1};

    if(password !== 'password') data.success = 0;

    return Observable.from([data]);

  }
}

