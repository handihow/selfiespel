import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthRoutingModule } from './auth-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgxAuthFirebaseUIModule } from 'ngx-auth-firebaseui';
import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { CallbackComponent } from './callback/callback.component';
import { MatVideoModule } from 'mat-video';

@NgModule({
	declarations: [
		HomeComponent,
		LoginComponent, 
		ProfileComponent,
		CallbackComponent],
	imports: [
    	AngularFireAuthModule,
    	AuthRoutingModule,
    	HttpClientModule,
    	NgxAuthFirebaseUIModule,
    	SharedModule,
    	MatVideoModule
	],
	exports: []
})
export class AuthModule {}