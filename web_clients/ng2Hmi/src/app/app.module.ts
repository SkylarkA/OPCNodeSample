import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { ProcessOverviewComponent } from './process-overview/process-overview.component';
import { GapAdjustmentComponent } from './gap-adjustment/gap-adjustment.component';


import { DataService } from './data.service';

@NgModule({
  declarations: [
    AppComponent,
    ProcessOverviewComponent,
    GapAdjustmentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [ DataService, appRoutingProviders ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

