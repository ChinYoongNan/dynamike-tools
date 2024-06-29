import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject, Observable } from 'rxjs';


@Component({
  selector: 'app-group-card',
  templateUrl: './group_card.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class GroupCardComponent implements OnInit {

  @Output() updatedData = new EventEmitter();
  @Output() nextPage = new EventEmitter();
  @Output() selectedIndex = new EventEmitter();
  @Input() notifier: Subject<void>;
  @Input() tableHeaderData: any ;
  @Input() tableSettings: any ;
  @Input() expandProperty: any ;
  @Input() dataPropertyKeys = [];
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
  ) { 
  }
  effect = 'scrollx';
  editCache: { [key: string]: { edit: boolean; data: any } } = {};
  nestedEditCache: { [key: string]: { edit: boolean; data: any } } = {};
  tableData: any ;
  ngOnInit() {
    this.init();

  }
  init() {  
    if(this.notifier){
      this.notifier.subscribe((data) => 
        this.subscription(data)
      );
    }    
  }
  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.notifier){
      this.notifier.unsubscribe();
    }
  }
  subscription(e){
    if(e['content']){
      console.log(e);
      this.tableData = e.content;
    }else{
      this.tableData = e;
      if(this.tableData){
        if(this.dataPropertyKeys.length == 0){
          this.dataPropertyKeys = Object.keys(this.tableData[0]);
        }      
      }
    }
  }
  formatImage(img: any): any {
    if(img){
      return this.common.formatImage(img);
    }
  }
  ngAfterContentInit() { 
  }
}
