import { BrowserModule } from '@angular/platform-browser';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

import { FooterComponent, HeaderComponent } from './shared/layout';
import { ThingsModule } from './things/things.module';
import { FactsModule } from './facts/facts.module';

import { ThingsComponent } from './things/things.component';
import { FactsComponent } from './facts/facts.component';

import {
  ApiService,
  ThingsService,
  FactsService
} from './shared/services';

const appRoutes: Routes = [
  { path: '', component: ThingsComponent, pathMatch: 'full' },
  { path: 'facts', component: FactsComponent }
];
const rootRouting = RouterModule.forRoot(
  appRoutes,
  { enableTracing: true } // <-- debugging purposes only
);

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    rootRouting,
    ThingsModule,
    FactsModule
  ],
  providers: [
    ApiService,
    ThingsService,
    FactsService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
