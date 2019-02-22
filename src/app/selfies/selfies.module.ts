import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ImagesModule } from '../images/images.module';
import { SelfiesRoutingModule } from './selfies-routing.module';

import { SelfiesComponent } from './selfies.component';

@NgModule({
  declarations: [SelfiesComponent],
  imports: [
    CommonModule,
    SelfiesRoutingModule,
    SharedModule,
    ImagesModule
  ]
})
export class SelfiesModule { }
