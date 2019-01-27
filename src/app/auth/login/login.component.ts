import { Component, OnInit } from '@angular/core';
import {AuthProvider} from 'ngx-auth-firebaseui';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  providers = AuthProvider;

  constructor() { }

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

}
