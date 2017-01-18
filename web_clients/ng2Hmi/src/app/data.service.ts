import { Injectable } from '@angular/core';
import { NotificationEvent } from './notificationevent'
import { Subject, BehaviorSubject, Observable, ConnectableObservable } from 'rxjs';
import { Data } from './models/data';

import * as io from 'socket.io-client';


@Injectable()
export class DataService {
  //private middlewareUrl: string = "http://localhost:3700/";
  private middlewareUrl: string = window.location.toString();

  private socket: SocketIOClient.Socket;
  private initial: Data = new Data();
  private lastView: string;

  newData: Subject<Data> = new BehaviorSubject<Data>(this.initial);

  constructor() {
    this.socket = io.connect(this.middlewareUrl);

    console.log( "location path : " + this.middlewareUrl);

    this.socket.on('connect', () => {
      console.log('socket connected');
      this.getLatestVarValues(this.lastView); // get the the latest Values for when server disconnected but page wasnt refreshed
    });
 
    this.socket.on('disconnect', () => {
      console.log('disconnected');
    });

    this.socket.on(NotificationEvent[NotificationEvent.NewData], (msg) => {
      this.newData.next(new Data(msg));
    });
  }

  getLatestVarValues(view) {
    this.socket.emit('LatestValues', view);
    this.lastView = view;
  }

  startSubscription(view) {
    this.socket.emit('StartSubscription', view);
  }

  writeBool(value) {
    this.socket.emit('WriteBool', value);
  }

  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}