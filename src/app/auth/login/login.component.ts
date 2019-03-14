import { Component, OnInit } from '@angular/core';
import {AuthProvider} from 'ngx-auth-firebaseui';
import { AuthMethod } from '../../models/auth-method.model';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  providers = AuthProvider;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  printUser(event) {
  	console.log("success");
	  console.log(event);
  }

  printError(event) {
  	console.log("error");
	  console.error(event);
  }

  onSuccess(user){
    console.log("onSuccess is called");
    let providerId = user.providerData[0] ? user.providerData[0].providerId : null;
    console.log(providerId);
    let authMethod: AuthMethod;
    switch (providerId) {
      case "google.com":
        authMethod = AuthMethod.google;
        break;
      case "facebook.com":
        authMethod = AuthMethod.facebook;
        break;
      case "twitter.com":
        authMethod = AuthMethod.twitter;
        break;
      default:
        authMethod = AuthMethod.email;
        break;
    }
    this.authService.updateUser(user, authMethod);
  }

}
