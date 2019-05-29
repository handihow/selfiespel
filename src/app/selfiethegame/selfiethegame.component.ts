import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-selfiethegame',
  templateUrl: './selfiethegame.component.html',
  styleUrls: ['./selfiethegame.component.css']
})
export class SelfiethegameComponent implements OnInit {

  images = [
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F1.%20Login%20screen.png?alt=media&token=7a5a88c2-d673-4aa3-9ed1-13a7aa2f6b00",
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F2.%20Home%20page%20with%20all%20games.png?alt=media&token=6f248356-1ab4-49b0-87c4-e6bc07adcf91",
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F3.%20Admin%20Screen%20-%20Add%20players%20to%20game%20with%20QR%20code.png?alt=media&token=c606501c-e6a0-46b3-8ef5-15e393e6688a",
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F4.%20Admin%20Screen%20-%20Create%20assignments%20for%20the%20selfie%20game.png?alt=media&token=a65dbf8f-1ae8-4fb0-bc81-2b90bbfa20c4",
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F5.%20Player%20Screen%20-%20Assignment%20page.png?alt=media&token=17155680-3da2-47ac-b8e5-f6ee09f6cdab",
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F6.%20Player%20Screen%20-%20Scroll%20through%20selfies%20of%20all%20teams%20and%20quick%20edit%20points.png?alt=media&token=8f4a237a-005c-4bbf-922b-c3e7b7d9baae",
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F7.%20Selfie%20Detail%20Screen.png?alt=media&token=3dea5f18-28ec-4ef5-bb69-f7c79342e2bb",
    "https://firebasestorage.googleapis.com/v0/b/handihow-186e5.appspot.com/o/selfiethegame%2F8.%20Chat%20Room%20for%20all%20players.png?alt=media&token=da4f4a14-9382-4f75-a82f-e8ea22c6f6fb"
  ];
  autoPlay: boolean = true;

  constructor(db: AngularFirestore) {
   }

  ngOnInit() {
  }

  toggleAutoPlay(){
  	this.autoPlay = !this.autoPlay
  }

}
