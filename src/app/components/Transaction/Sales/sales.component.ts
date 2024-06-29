import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { DataService } from "../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class SalesComponent implements OnInit {

  pageHeader = {
    Title: "Transaction Sales"
  }  
  
  nestedHeaderData=[
    {
      header:"Item Id",
      column:"itemId",
      edit: true,
      type: "text"
    },
    {
      header:"Name",
      column:"productName",
      edit: true,
      type: "text"
    },
    {
      header:"Quantity",
      column:"quantity",
      edit: true,
      type: "text"
    },
    {
      header:"Selling Price",
      column:"unitPrice",
      edit: true,
      type: "text"
    },
    {
      header:"Total Price",
      column:"totalPrice",
      edit: true,
      type: "text"
    }
  ]
  headerData=[
    {
      header:"Id",
      column:"id",
      edit:false,
      type:null,
    },
    {
      header:"Date",
      column:"date",
      edit:false,
      type:null,
    },
    {
      header:"Cash Sales No",
      column:"cashSalesNo",
      edit: true,
      type: "text"
    },
    {
      header:"Final Total",
      column:"finalTotal",
      edit: true,
      type: "text"
    },
    {
      header:"Payment Mode",
      column:"paymentMode",
      edit: true,
      type: "text"
    },
    {
      header:"Published",
      column:"loaded",
      edit: true,
      type: "text"
    }
  ];
  expandProperty="orderItemList";
  tableSettings = {
    Delete : {
      function: this.deleteButton
    },
    Action: {            
      CustomFunction:[
        {
          desc:"print",
          function: this.printButton   
        }
      ],
      Update:{        
        function: this.updateButton        
      }
    },
    nested :{
      tableHeaderData :this.nestedHeaderData,
      // Delete : {
      //   function: this.deleteButton
      // },
      // Action: {
      //   Update:{        
      //     function: this.updateButton        
      //   }
      // }
    }
  }

  tableData : Subject<any> = new Subject<any>();
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef, 
  ) { 
  }

  // salesTypes = [
  //   {"id":"1","value":"Retail Shop / 实体店"},
  //   {"id":"4","value":"Restaurant / 小吃店"},
  //   {"id":"3","value":"Grab Mart"},
  //   {"id":"5","value":"Grab Food"},
  //   // {"id":"2","value":"IT"}
  // ]
  salesTypes:any=[]
  salesType ="1";
  Sales :any;
  startdate;
  enddate;
  total: 0.00;
  mode:any = "1";
  outlet:any = "1";
  provider:any;
  
  getProvider(provider: any) {
    this.provider = provider;
    this.salesType = provider.id;
    console.log(provider);
    this.searchRecord()
  }
  init() {
    if(this.router.url == '/CafeSales'){
      // this.salesTypes = [
      //   {"id":"4","value":"Café / 小吃店"},
      //   {"id":"5","value":"Grab Food"},
      // ]
      this.salesType = "4";
      this.mode = "4";
      this.outlet = "2";       
      this.cdr.detectChanges();
    }else{
      // this.dcrService.getProvider().subscribe(data => {
      //   // this.ProviderLoadSel = false;
      //   console.log(data);
      //   this.salesTypes = Object.assign(data);
      //   // this.Provider = data;
      // }, error => {
      //   if (error.error.text != "No Results") {
      //     this.common.errStatus(error.status, error.error);
      //   }
      // })
      // this.salesTypes = [
      //   {"id":"1","value":"Retail Shop / 实体店"},
      //   {"id":"4","value":"Café / 小吃店"},
      //   {"id":"3","value":"Grab Mart"},
      //   {"id":"5","value":"Grab Food"},
      //   // {"id":"2","value":"IT"}
      // ]
      this.salesType = "1";
      this.mode = "1";
    }
    
    this.searchRecord();
  }
  loadIntoLedgerButton(id){
    document.getElementById("loadButton").click();    
  }
  loadIntoLedger()
  {
    let promise = new Promise((resolve, reject) => {
      this.dcrService.loadIntoLedger(this.id)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Load successful!!!");    
            this.reload();     
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  searchRecord(){
    if(this.startdate==null && this.enddate==null)
    {
      // let d = new Date().setDate(new Date().getDate()-1);
      this.startdate = new Date().toISOString().split("T")[0];
      this.enddate = new Date().toISOString().split("T")[0];
    }
    this.nextPage(this.common.formatDateZone(this.startdate),this.common.formatDateZone(this.enddate),0,10);
  }
  paginationData:any;
  nextPageSetting(data){
    this.paginationData = data;
    this.nextPage(this.startdate,this.enddate,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
  }
  reload(){    
    if(this.paginationData){
      this.nextPage(this.startdate,this.enddate,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
      return;
    }
    this.nextPage(this.startdate,this.enddate,0,10);
  }

  async nextPage(startdate,enddate,page,size){
    let data = await this.dataService.getSalesByDates(this.salesType,startdate,enddate,page,size);
    let result = await this.dataService.getSalesFinalTotalAmount(this.salesType,startdate,enddate,page,size);
    if(result['count']){
      document.getElementById("total").innerHTML = "Order : "+result['count']+" / Total : "+ result['amount'];
    }else{
      document.getElementById("total").innerHTML = "Final Total Amount: "+ result;
    }   
    if(this.provider && this.provider.category){
      switch(this.provider.category.toString()){
        case '1':{
          if(result['count']){
            document.getElementById("total").innerHTML = "Order : "+result['count']+" / Total : "+ result['amount'] + " / Net : "+ result['netamount'] ;
          }else{
            document.getElementById("total").innerHTML = "Final Total Amount : "+ result;
          }  
          this.headerData=[
            {
              header:"Id",
              column:"id",
              edit:false,
              type:null,
            },
            {
              header:"Date",
              column:"date",
              edit:false,
              type:null,
            },
            {
              header:"Cash Sales No",
              column:"clientName",
              edit: true,
              type: "text"
            },
            {
              header:"Final Total",
              column:"finalTotal",
              edit: true,
              type: "text"
            },
            {
              header:"Payment Mode",
              column:"paymentMode",
              edit: true,
              type: "text"
            },
            {
              header:"Published",
              column:"loaded",
              edit: true,
              type: "text"
            }
          ];
          break;
        }
        default:{
          if(result['count']){
            document.getElementById("total").innerHTML = "Order : "+result['count']+" / Total : "+ result['amount'] ;
          }else{
            document.getElementById("total").innerHTML = "Final Total Amount: "+ result;
          }  
          this.headerData=[
            {
              header:"Id",
              column:"id",
              edit:false,
              type:null,
            },
            {
              header:"Date",
              column:"date",
              edit:false,
              type:null,
            },
            {
              header:"Cash Sales No",
              column:"cashSalesNo",
              edit: true,
              type: "text"
            },
            {
              header:"Final Total",
              column:"finalTotal",
              edit: true,
              type: "text"
            },
            {
              header:"Payment Mode",
              column:"paymentMode",
              edit: true,
              type: "text"
            },
            {
              header:"Published",
              column:"loaded",
              edit: true,
              type: "text"
            }
          ];
        }
      }
    }
    if(data){
        // this.Sales = data["content"];
        this.Sales=data;
        this.common.notifyChild(this.tableData,data);
    }
  }

  ngOnInit(): void {
    this.init();
  }
  id: any;
  deleteButton(){
    document.getElementById("deleteButton").click()
  }
  updateButton() {
    document.getElementById("updateButton").click()
  }
  printButton(){
    document.getElementById("printButton").click();    
  }
  generateSelectedReceipt() {
    this.dcrService.serverPrintBySelectedId('posreceipt', this.updateData.id);
  }
  getSelectedIndex(data){
    this.id = data;
  }
  updateData:any;
  getUpdatedData(data){
    this.updateData = data;
  }
  ngAfterContentInit() { 
  }
  deleteSales(){    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteSales(this.id)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("delete successful!!!");   
            this.init();         
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    
  }
}
