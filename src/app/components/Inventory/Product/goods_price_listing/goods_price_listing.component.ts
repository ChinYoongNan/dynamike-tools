import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { AnyTxtRecord } from 'dns';
import { Console } from 'console';
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-goods_price_listing',
  templateUrl: './goods_price_listing.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class GoodsPriceListComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  headerData=[
    {      
      header:"Purchase Id",
      column:"purchase",
      nestedColumn:"id",
      edit:false,
      type:"test"
    },    
    {
      header:"Date / 日期",
      column:"purchase",
      nestedColumn:"date",
      edit:false,
      type:null
    },
    {
      header:"Unit Cost / 本钱",
      column:"unitCost",
      edit: true,
      type: "text"
    },
    {
      header:"Suppiler / 供应商",
      value:'purchase.supplier.name',
      edit: false,
      type: "text"
    },    
    {
      header:"Invoice Id / 进货单号码",
      column:"purchase",
      nestedColumn:"invoiceNo",
      edit: true,
      type: "text"
    },        
    {
      header:"Quantity / 数量",
      column:"quantity",
      edit: true,
      type: "text"
    }
  ];
  tableSettings = {   
  }
  @Input() notifier: Subject<void>;
  tableData : Subject<any> = new Subject<any>();
  ngOnInit(): void {   
    this.init()  
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
    // this.Purchases = e;
    if(e['content']){
      this.common.notifyChild(this.tableData,e);
    }
  }

  ngAfterContentInit() {
  }

  Purchases:any=[];
  isVisible: boolean = false;
  NoResultId = "No Data"

  @Output() getPaginationData = new EventEmitter();
  paginationData:any;
  nextPageSetting(data){
    this.paginationData = data;
    this.getPaginationData.emit(this.paginationData);
  }
  
}
