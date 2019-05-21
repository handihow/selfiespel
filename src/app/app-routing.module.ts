import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
	{
		path: 'privacy',
		component: PrivacyComponent
	},
	{
	  path: 'games',
	  loadChildren: './games/games.module#GamesModule'
	},
	{
	  path: 'selfies',
	  loadChildren: './selfies/selfies.module#SelfiesModule'
	},
	{
	  path: 'contacts',
	  loadChildren: './contacts/contacts.module#ContactsModule'
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
