import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

import { Subscription, Observable, of } from 'rxjs';

import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer'; 

import { Image } from '../images/image.model';
import { ImageService } from '../images/image.service';

import { User } from '../auth/user.model';

@Component({
  selector: 'app-selfies',
  templateUrl: './selfies.component.html',
  styleUrls: ['./selfies.component.css']
})
export class SelfiesComponent implements OnInit {

  imageReferences: Image[];
  images$: Observable<string>[] = [];
  subs: Subscription[] = [];
  user: User;

  constructor(	private storage: AngularFireStorage,
  				private imageService: ImageService,
  				private store: Store<fromRoot.State>) { }

  ngOnInit() {
  	this.subs.push(this.store.select(fromRoot.getCurrentUser).subscribe(user => {
        if(user){
          this.user = user;
	      this.subs.push(this.imageService.fetchUserImageReferences(this.user.uid).subscribe(imageReferences =>{
	        this.imageReferences = imageReferences;
	        this.createImageArray();
	      }))
        }
    }));
  }

  ngOnDestroy(){
    this.subs.forEach(sub => {
    	sub.unsubscribe();
    })
  }

  createImageArray(){
    this.images$ = [];
    this.imageReferences.forEach(imageRef => {
      const ref = this.storage.ref(imageRef.path);
      const downloadURL$ = ref.getDownloadURL();
      this.images$.push(downloadURL$);
    })
  }

}
