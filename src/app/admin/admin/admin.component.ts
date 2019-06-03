import { Component, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  result$: Observable<any>;

  constructor(private fns: AngularFireFunctions) { }

  ngOnInit() {
  }

  setModerator(){
  	const callable = this.fns.httpsCallable('addModerator');
    this.result$ = callable({ email: 'roelandverbakel@gmail.com' });
  }

  removeModerator(){
    const callable = this.fns.httpsCallable('removeModerator');
    this.result$ = callable({ email: 'roelandverbakel@gmail.com' });
  }
}
