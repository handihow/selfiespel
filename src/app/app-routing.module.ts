import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { PrivacyComponent } from './privacy/privacy.component';
import { TosComponent } from './tos/tos.component';
import { FaqComponent } from './faq/faq.component';
import { SelfiethegameComponent } from './selfiethegame/selfiethegame.component';

const routes: Routes = [
	{
		path: 'info',
		component: SelfiethegameComponent
	},
	{
		path: 'privacy',
		component: PrivacyComponent
	},
	{
		path: 'tos',
		component: TosComponent
	},
	{
		path: 'faq',
		component: FaqComponent
	},
	{
	  path: 'games',
	  loadChildren: './games/games.module#GamesModule'
	},
	{
	  path: 'admin',
	  loadChildren: './admin/admin.module#AdminModule'
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
