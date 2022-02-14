import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared';
import { FactsComponent } from './facts.component';


@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    FactsComponent
  ]
})
export class FactsModule { }
