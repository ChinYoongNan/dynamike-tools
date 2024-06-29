import {Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

import { DcrService } from "../../../services/dcr.service";
import { DataService } from "../../../services/data.service";
import { CommonService } from "../../../services/common.service";

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit {

  constructor(
    private dataService: DataService
  ) { 
  }
  outlet:any = {
    id: '',
  };
  @Input() outletId:any;
  @Output() getOutletEvent = new EventEmitter<string>();
  getOutlet(value) {
    this.getOutletEvent.emit(value);
  }
  outletType : any = [
    {
      "id":"1",
      "description":"S6",
    },
    {
      "id":"2",
      "description":"14G",
    },
    {
      "id":"3",
      "description":"IT",
    },
    {
      "id":"4",
      "description":"Insurance",
    },
    {
      "id":"5",
      "description":"Kiosk",
    },
  ];
  ngOnInit(){
    this.loadOutlets();
  }
  async loadOutlets(){

    this.outlet = await this.dataService.loadOutlets();
    console.log("this.outletId"+this.outletId)
    this.outlet.id =this.outletId;
  }
  ngOnChanges(){
    console.log("this.outletId"+this.outletId)
    this.outlet.id =this.outletId;

  }

}
