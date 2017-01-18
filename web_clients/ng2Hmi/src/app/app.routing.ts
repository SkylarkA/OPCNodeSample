import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessOverviewComponent } from './process-overview/process-overview.component';
import { GapAdjustmentComponent } from './gap-adjustment/gap-adjustment.component';

const routes: Routes = [
  { path: '', component: ProcessOverviewComponent },
  { path: 'process-overview', component: ProcessOverviewComponent },
  { path: 'gap-adjustment', component: GapAdjustmentComponent }
];

export const appRoutingProviders: any[] = [

];


export const routing: ModuleWithProviders = RouterModule.forRoot(routes);


