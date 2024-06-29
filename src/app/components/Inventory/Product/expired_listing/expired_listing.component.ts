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
  selector: 'app-expired_listing',
  templateUrl: './expired_listing.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ExpiredListComponent implements OnInit {
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
  
  // headerdate = [ "Update Expired / 记录","Split Record"];
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
      header:"Suppiler / 供应商",
      value:'purchase.supplier.name',
      edit: false,
      type: "text"
    },    
    {
      header:"Invoice Id / 进货单号码",
      column:"purchase",
      nestedColumn:"invoiceNo",
      edit: false,
      type: "text"
    },       
    {
      header:"Quantity / 数量",
      column:"quantity",
      edit: false,
      type: "text"
    },            
    {
      header:"Expired / 过期",
      column:"expired",
      edit: true,
      type: "text"
    }
  ];
  tableSettings = {      
    Action: {
      Update:{        
        function: this.updateButton        
      },      
      customPopFunction:{
        function: this.splitButton,
        name: 'Split',
        title: 'Split Quantity'
      }
    },
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
  id:any;
  updateButton(){
    document.getElementById("updateButton").click();
    console.log('updateExpiredDate');
  }
  splitButton(){
    document.getElementById("splitButton").click();
  }
  updateExpiredDate(){
    console.log('updateExpiredDate');
    console.log(this.updateData);
    let promise = new Promise((resolve, reject) => {
      this.dcrService.updateExpired(this.updateData)
          .toPromise()
          .then(
            res => { // Success
              this.common.createBasicMessage("save successful!!!");
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }
  getSelectedIndex(data){
    this.id = data;
  }
  updateData:any;
  getUpdatedData(data){
    this.updateData = data;
  }

  Purchases:any=[];
  isVisible: boolean = false;
  NoResultId = "No Data"
 


  splitPurchases=[];
  split_quantity = 0;
  split(){
    let quantity = null;
    if(quantity == null){
      quantity = this.id;
    }
    let promise = new Promise((resolve, reject) => {
      this.splitPurchases = [];
      let splited;
      splited = JSON.parse(JSON.stringify(this.updateData));
      splited.id = null;
      splited.quantity = quantity;
      this.updateData.quantity = parseInt(this.updateData.quantity) - parseInt(quantity);
      this.splitPurchases.push(this.updateData);
      this.splitPurchases.push(splited);
      this.dcrService.splitExpired(this.splitPurchases)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  @Output() getPaginationData = new EventEmitter();
  paginationData:any;
  nextPageSetting(data){
    this.paginationData = data;
    this.getPaginationData.emit(this.paginationData);
  }
}
