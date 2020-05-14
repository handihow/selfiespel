import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { PrivacyComponent } from './privacy/privacy.component';
import { TosComponent } from './tos/tos.component';
import { SupportComponent } from './support/support.component';

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
		path: 'support',
		component: SupportComponent
	},
	{
		path: 'faq',
		component: FaqComponent
	},
	{
	  path: 'games',
	  loadChildren: () => import('./games/games.module').then(m => m.GamesModule)
	},
	{
	  path: 'admin',
	  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
	},
	{
	  path: 'selfies',
	  loadChildren: () => import('./selfies/selfies.module').then(m => m.SelfiesModule)
	},
	// {
	//   path: 'contacts',
	//   loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
	// },
	{
	  path: 'assignments',
	  loadChildren: () => import('./assignments/assignments.module').then(m => m.AssignmentsModule)
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
