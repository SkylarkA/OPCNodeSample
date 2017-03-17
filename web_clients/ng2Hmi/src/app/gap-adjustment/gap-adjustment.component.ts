import { Component, ViewChildren, HostListener, AfterViewInit } from '@angular/core';

import { DataService } from '../data.service';
import { Data } from '../models/data';

import * as cGauges from 'canvas-gauges';


@Component({
  selector: 'gap-adjustment',
  templateUrl: './gap-adjustment.component.html',
  styleUrls: ['./gap-adjustment.component.css'],
})

export class GapAdjustmentComponent implements AfterViewInit {
  @ViewChildren('gauge') gauges;
  @HostListener('window:resize', ['$event']) onResize(event) {

    event.target.document.gauges.forEach(function (gauge) {
      gauge.update({
        height: gauge.canvas.element.parentElement.offsetHeight,
        width: gauge.canvas.element.parentElement.offsetWidth
        //height: this.getParentHeight(gauge.options.renderTo.toString())
      }) // redraw all gauges on resize
    });
  }

  private gapMonitoredVars: Object;

  constructor(private dataService: DataService) {
    // setup our nodeId list and get the latest values
    this.dataService.nodeIdListLatestValues
      .subscribe(data => {
        this.gapMonitoredVars = data;
      })
    this.dataService.switchView("Gap_Adjustment");
  }

  ngAfterViewInit() {
    // TODO: simplify gauges init
    // Init Gauges
    var gaugeLeft1 = new cGauges.LinearGauge({
      renderTo: 'gauge-left1',
      colorPlate: 'transparent',
      minValue: 0,
      maxValue: 10000,
      majorTicks: [
        1000,
        3000,
        5000,
        8000,
        10000
      ],
      minorTicks: 5,
      strokeTicks: true,
      ticksWidth: 18,
      ticksWidthMinor: 7.5,
      highlights: [
        {
          "from": 0,
          "to": 0,
          "color": "rgba(0,0, 255, .3)"
        },
        {
          "from": 0,
          "to": 10000,
          "color": "rgba(255, 0, 0, .3)"
        }
      ],
      colorMajorTicks: "#ffe66a",
      colorMinorTicks: "#ffe66a",
      colorTitle: "black",
      colorUnits: "#ccc",
      colorNumbers: "black",
      borders: false,
      borderOuterWidth: 1,
      animateOnInit: false,
      animationRule: "linear", // ? oder linear
      animationDuration: 250,
      fontTitleSize: 25,
      needleType: "arrow",
      needleWidth: 7,
      barWidth: 8,
      valueBox: false,
      tickSide: "left",
      numberSide: "left",
      needleSide: "left",
      colorNeedle: "#5B5B5B",
      colorNeedleEnd: '#5B5B5B',
      colorBarProgress: "#327ac0",
      colorBar: "#f5f5f5",
      value: 0,
      barBeginCircle: 0,
      title: "Force Top",
      units: "",
      height: this.getParentHeight('gauge-left1'),
      //width: this.getParentwidth('gauge-left1'),
    }).draw();

    var gaugeLeft2 = new cGauges.LinearGauge({
      renderTo: 'gauge-left2',
      colorPlate: 'transparent',
      minValue: 0,
      maxValue: 10000,
      majorTicks: [
        1000,
        3000,
        5000,
        8000,
        10000
      ],
      minorTicks: 5,
      strokeTicks: true,
      ticksWidth: 18,
      ticksWidthMinor: 7.5,
      highlights: [
        {
          "from": 0,
          "to": 0,
          "color": "rgba(0,0, 255, .3)"
        },
        {
          "from": 0,
          "to": 10000,
          "color": "rgba(255, 0, 0, .3)"
        }
      ],
      colorMajorTicks: "#ffe66a",
      colorMinorTicks: "#ffe66a",
      colorTitle: "black",
      colorUnits: "#ccc",
      colorNumbers: "black",
      borders: false,
      borderOuterWidth: 1,
      animateOnInit: false,
      animationRule: "linear", // ? oder linear
      animationDuration: 250,
      fontTitleSize: 25,
      needleType: "arrow",
      needleWidth: 5,
      barWidth: 8,
      valueBox: false,
      tickSide: "left",
      numberSide: "left",
      needleSide: "left",
      colorNeedle: "#5B5B5B",
      colorNeedleEnd: '#5B5B5B',
      colorBarProgress: "#327ac0",
      colorBar: "#f5f5f5",
      value: 0,
      barBeginCircle: 0,
      title: "Force Bottom",
      units: "",
      height: this.getParentHeight('gauge-left2'),
      //width: this.getParentwidth('gauge-left2'),
    }).draw();

    var gaugeRight1 = new cGauges.LinearGauge({
      renderTo: 'gauge-right1',
      colorPlate: 'transparent',
      minValue: 0,
      maxValue: 10000,
      majorTicks: [
        1000,
        3000,
        5000,
        8000,
        10000
      ],
      minorTicks: 5,
      strokeTicks: true,
      ticksWidth: 18,
      ticksWidthMinor: 7.5,
      highlights: [
        {
          "from": 0,
          "to": 0,
          "color": "rgba(0,0, 255, .3)"
        },
        {
          "from": 0,
          "to": 10000,
          "color": "rgba(255, 0, 0, .3)"
        }
      ],
      colorMajorTicks: "#ffe66a",
      colorMinorTicks: "#ffe66a",
      colorTitle: "black",
      colorUnits: "#ccc",
      colorNumbers: "black",
      borders: false,
      borderOuterWidth: 1,
      animateOnInit: false,
      animationRule: "linear", // ? oder linear
      animationDuration: 250,
      fontTitleSize: 25,
      needleType: "arrow",
      needleWidth: 5,
      barWidth: 8,
      valueBox: false,
      tickSide: "left",
      numberSide: "left",
      needleSide: "left",
      colorNeedle: "#5B5B5B",
      colorNeedleEnd: '#5B5B5B',
      colorBarProgress: "#327ac0",
      colorBar: "#f5f5f5",
      value: 0,
      barBeginCircle: 0,
      title: "Force Top",
      units: "",
      height: this.getParentHeight('gauge-right1'),
      //width: this.getParentwidth('gauge-left2'),
    }).draw();

    var gaugeRight2 = new cGauges.LinearGauge({
      renderTo: 'gauge-right2',
      colorPlate: 'transparent',
      minValue: 0,
      maxValue: 10000,
      majorTicks: [
        1000,
        3000,
        5000,
        8000,
        10000
      ],
      minorTicks: 5,
      strokeTicks: true,
      ticksWidth: 18,
      ticksWidthMinor: 7.5,
      highlights: [
        {
          "from": 0,
          "to": 0,
          "color": "rgba(0,0, 255, .3)"
        },
        {
          "from": 0,
          "to": 10000,
          "color": "rgba(255, 0, 0, .3)"
        }
      ],
      colorMajorTicks: "#ffe66a",
      colorMinorTicks: "#ffe66a",
      colorTitle: "black",
      colorUnits: "#ccc",
      colorNumbers: "black",
      borders: false,
      borderOuterWidth: 1,
      animateOnInit: false,
      animationRule: "linear", // ? oder linear
      animationDuration: 250,
      fontTitleSize: 25,
      needleType: "arrow",
      needleWidth: 5,
      barWidth: 8,
      valueBox: false,
      tickSide: "left",
      numberSide: "left",
      needleSide: "left",
      colorNeedle: "#5B5B5B",
      colorNeedleEnd: '#5B5B5B',
      colorBarProgress: "#327ac0",
      colorBar: "#f5f5f5",
      // value: this.gapMonitoredVars['ns=3;s=TF1.UF_H_C.AppLoop.HboDis.ActFrDs'],
      value: 0,
      barBeginCircle: 0,
      title: "Force Bottom",
      units: "",
      height: this.getParentHeight('gauge-right2'),
      //width: this.getParentwidth('gauge-left2'),
    }).draw();
    // End Init Gauges

    this.dataService.newData
      .subscribe(data => {
        this.gapMonitoredVars[data.NodeID] = data.value;
        switch (data.NodeID) {
          case 'ns=3;s=TF1.UF_H_C.AppLoop.HtpDis.ActFrOs':
            gaugeLeft1.value = data.value;
            break;
          case 'ns=3;s=TF1.UF_H_C.AppLoop.HboDis.ActFrOs':
            gaugeLeft2.value = data.value;
            break;
          case 'ns=3;s=TF1.UF_H_C.AppLoop.HtpDis.ActFrDs':
            gaugeRight1.value = data.value;
            break;
          case 'ns=3;s=TF1.UF_H_C.AppLoop.HboDis.ActFrDs':
            gaugeRight2.value = data.value;
            break;
        }
      });


    this.dataService.startSubscription("Gap_Adjustment");
    console.log("Setup GapAdjustment complete")
  }

  getParentHeight(gaugeId) {
    return this.gauges.find(element => gaugeId == element.nativeElement.getAttribute('id')).nativeElement.parentNode.offsetHeight;
  }

  getParentwidth(gaugeId) {
    // first finds the correct element from the querylist than gets its parents width 
    return this.gauges.find(element => gaugeId == element.nativeElement.getAttribute('id')).nativeElement.parentNode.offsetWidth;
  }

  onWriteTrue() {
    this.dataService.writeBool(true);
  }

  onWriteFalse() {
    this.dataService.writeBool(false);
  }

  returnBoolValue() {
    if (this.gapMonitoredVars["ns=3;s=TF1.UR_STAC.AppLogic.Sim_Start"]) {
      return "red"
    }
  }
}
