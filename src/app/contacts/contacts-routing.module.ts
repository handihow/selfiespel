import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/auth.guard';

import { ContactsComponent } from './contacts/contacts.component';

const routes: Routes = [
	{ path: '', component: ContactsComponent, canLoad: [AuthGuard], pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
