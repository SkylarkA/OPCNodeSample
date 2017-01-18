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
    this.poMonitoredVars = {
      "ns=3;s=TF1.UF_H_C.AppLoop.HtpDis.ActFrOs": 0,
      "ns=3;s=TF1.UF_V_C.LifeCnt.LifeCnt_UF_V_C_Logi": 0,
      "ns=3;s=TF1.UF_H_C.AppLoop.HtpDis.ActFrDs" : 0,
      "ns=3;s=TF1.UF_H_C.AppLoop.HtpDis.ActSrgDs" : 0,
      "ns=3;s=TF1.UF_H_C.AppLoop.HtpDis.ActSrgOs" : 0,
      "ns=3;s=TF1.UF_H_C.AppLoop.HboDis.ActFrOs" : 0,
      "ns=3;s=TF1.UF_H_C.AppLoop.HboDis.ActFrDs" : 0,
      "ns=3;s=TF1.UF_H_C.AppLoop.HboDis.ActSrgDs" : 0,
      "ns=3;s=TF1.UF_H_C.AppLoop.HboDis.ActSrgOs" : 0,
      "ns=3;s=TF1.UF_V_C.AppLoop.VosDis.ActFrEs" : 0,
      "ns=3;s=TF1.UF_V_C.AppLoop.VosDis.ActSrgEs" : 0,
      "ns=3;s=TF1.UF_V_C.AppLoop.VdsDis.ActFrEs" : 0,
      "ns=3;s=TF1.UF_V_C.AppLoop.VdsDis.ActSrgEs" : 0,

  
      "ns=3;s=TF1.UR_H_C.AppLoop.HtpDis.ActFrOs": 0,
      "ns=3;s=TF1.UR_H_C.AppLoop.HtpDis.ActFrDs" : 0,
      "ns=3;s=TF1.UR_H_C.AppLoop.HtpDis.ActSrgDs" : 0,
      "ns=3;s=TF1.UR_H_C.AppLoop.HtpDis.ActSrgOs" : 0,
      "ns=3;s=TF1.UR_H_C.AppLoop.HboDis.ActFrOs" : 0,
      "ns=3;s=TF1.UR_H_C.AppLoop.HboDis.ActFrDs" : 0,
      "ns=3;s=TF1.UR_H_C.AppLoop.HboDis.ActSrgDs" : 0,
      "ns=3;s=TF1.UR_H_C.AppLoop.HboDis.ActSrgOs" : 0,
      "ns=3;s=TF1.UR_V_C.AppLoop.VosDis.ActFrEs" : 0,
      "ns=3;s=TF1.UR_V_C.AppLoop.VosDis.ActSrgEs" : 0,
      "ns=3;s=TF1.UR_V_C.AppLoop.VdsDis.ActFrEs" : 0,
      "ns=3;s=TF1.UR_V_C.AppLoop.VdsDis.ActSrgEs" : 0,

      "ns=3;s=TF1.E_H_C.AppLoop.HtpDis.ActFrOs" : 0,
      "ns=3;s=TF1.E_H_C.AppLoop.HtpDis.ActFrDs" : 0,
      "ns=3;s=TF1.E_H_C.AppLoop.HtpDis.ActSrgDs" : 0,
      "ns=3;s=TF1.E_H_C.AppLoop.HtpDis.ActSrgOs" : 0,
      "ns=3;s=TF1.E_H_C.AppLoop.HboDis.ActFrOs" : 0,
      "ns=3;s=TF1.E_H_C.AppLoop.HboDis.ActFrDs" : 0,
      "ns=3;s=TF1.E_H_C.AppLoop.HboDis.ActSrgDs" : 0,
      "ns=3;s=TF1.E_H_C.AppLoop.HboDis.ActSrgOs" : 0
    }
  }

  ngOnInit() {
    console.log("this is a lifecycle hook");
    this.dataService.getLatestVarValues("All");
    //this.dataService.startSubscription("Process_Overview");
    // newData might need to run after viewChanged 
    this.dataService.newData
      .subscribe(data => {
        //console.log(data);
        this.poMonitoredVars[data.NodeID] = data.value;
      });
  }
}
