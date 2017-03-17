import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from '../data.service';
import { Data } from '../models/data';


@Component({
  selector: 'process-overview',
  templateUrl: './process-overview.component.html',
  styleUrls: ['./process-overview.component.css'],
})
export class ProcessOverviewComponent implements OnInit {

  private poMonitoredVars: Object;

  constructor(private dataService: DataService) {
    this.dataService.nodeIdListLatestValues
      .subscribe(data => {
        this.poMonitoredVars = data;
      })
    this.dataService.switchView("Process_Overview");
  }

  ngOnInit() {
    this.dataService.startSubscription("Process_Overview");
    // subscription might need to run after viewChanged 
    this.dataService.newData
      .subscribe(data => {
        this.poMonitoredVars[data.NodeID] = data.value;
      });
    console.log("Setup GapAdjustment complete")
  }
}
