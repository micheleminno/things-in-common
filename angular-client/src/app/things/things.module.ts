import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ThingsComponent } from './things.component';
import { SharedModule } from '../shared';
import { RangePipe } from './range.pipe';
import { OrderByPipe } from './order-by.pipe';
import { FilterPipe } from './filter.pipe';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ThingsComponent,
    RangePipe,
    OrderByPipe,
    FilterPipe
  ],
  providers: []
})
export class ThingsModule {}
