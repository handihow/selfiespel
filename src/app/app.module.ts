import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';

import { environment } from '../environments/environment';

// import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
// import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MaterialModule } from './material.module';
import { SharedModule } from './shared/shared.module';

import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
// import { MatContactsModule } from '@angular-material-extensions/contacts';
// import { MatFaqModule } from '@angular-material-extensions/faq';
import { MatPagesModule } from '@angular-material-extensions/pages';
import { ImgFallbackModule } from 'ngx-img-fallback';
import {SlideshowModule} from 'ng-simple-slideshow';

import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { UIService } from './shared/ui.service';
import { GameService } from './games/game.service';
import { ImageService } from './images/image.service';
import { AssignmentService } from './assignments/assignment.service';
import { TeamService } from './teams/team.service';
import { ChatService} from './chats/chats.service';
// import { ContactsService } from './contacts/contacts.service';

import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';

import { ServiceWorkerModule } from '@angular/service-worker';
import { NotifierModule } from 'angular-notifier';
import { Settings } from './shared/settings';
import { PrivacyComponent } from './privacy/privacy.component';
import { SelfiethegameComponent } from './selfiethegame/selfiethegame.component';
import { TosComponent } from './tos/tos.component';
import { SupportComponent } from './support/support.component';

import { FaqComponent } from './faq/faq.component';

export function loginFunction():string { 
    return 'com.handihow.selfiespel' 
}

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    PrivacyComponent,
    SelfiethegameComponent,
    TosComponent,
    SupportComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MaterialModule,
    BrowserAnimationsModule,
    ImgFallbackModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgxAuthFirebaseUIModule.forRoot(
        environment.firebase, 
        loginFunction, 
        {
            enableFirestoreSync: true,
            toastMessageOnAuthSuccess: true,
            toastMessageOnAuthError: true,
            enableEmailVerification: true,
            guardProtectedRoutesUntilEmailIsVerified: true,
            authGuardFallbackURL: '/', // url for unauthenticated users - to use in combination with canActivate feature on a route
            authGuardLoggedInURL: '/games', 
        }),
    MatPagesModule.forRoot(),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireAnalyticsModule,
    FlexLayoutModule,
    AuthModule,
    SharedModule,
    NotifierModule.withConfig( Settings.notifierOptions ),
    StoreModule.forRoot(reducers),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    SlideshowModule
  ],
  providers: [
    AuthService,
    UIService,
    GameService,
    ImageService,
    AssignmentService,
    ChatService,
    // ContactsService,
    TeamService],
  bootstrap: [AppComponent]
})
export class AppModule { }
