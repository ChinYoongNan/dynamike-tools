import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { AnyTxtRecord } from 'dns';
import { Console } from 'console';
@Component({
  selector: 'app-cashflow',
  templateUrl: './cashflow.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class CashFlowComponent implements OnInit {
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
  ngOnInit(): void {
    this.init();
  }




  ngAfterContentInit() {
    
  }

  
  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"

  productListData: any[];
  productName: string;
  // columnData: { name?: "", upgradeProducts?: { releases: [] } } = { name: "", "upgradeProducts": { "releases": [] } };
  columnData: any[];
  column: any[];
  headerName: any[];
  headerNameArr: any[];
  rowLen: number;
  tableEmpty: boolean = true;
  

  formatTime(min) {
    return moment(min).format('yyyy-MM-DD')
  }

  onScroll(s) {
  }

  //highLight
  tdSelected: any;

  YearLoadSel: boolean = true;
  AccountYears: any;
  year_index: any;
  month_index:any;
  month : any[] = [{"id":1,"value":"January 一月"},
  {"id":2,"value":"Feburary 二月"},
  {"id":3,"value":"March 三月"},
  {"id":4,"value":"April 四月"},
  {"id":5,"value":"May 五月"},
  {"id":6,"value":"June 六月"},
  {"id":7,"value":"July 七月"},
  {"id":8,"value":"August 八月"},
  {"id":9,"value":"September 九月"},
  {"id":10,"value":"October 十月"},
  {"id":11,"value":"November 十一月"},
  {"id":12,"value":"December 十二月"}]
  headerdate = [
    {
      name: '',
      sortOrder: null,
      sortFn: null,
      sortDirections: null
    },
    {
      name: 'Date / 日期',
      sortOrder: 'descend',
      sortFn: (a, b) => a.date - b.date,
      sortDirections: ['descend', null]
    },
    {
      name: 'Particular / 内容',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.particular - b.particular
    },
    {
      name: 'Invoice No / 单号码',
      sortOrder: 'descend',
      sortFn: (a, b) => a.invoiceNo - b.invoiceNo,
      sortDirections: ['descend', null]
    },
    {
      name: 'Type / 单类',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.invoiceNo - b.invoiceNo
    },
    {
      name: 'Amount / 总额',
      sortOrder: 'descend',
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a, b) => a.totalAmount.localeCompare(b.totalAmount)
    },
    {
      name: 'Paid / 已付',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: null
    },
    {
      name: 'Detail / 记录',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: null
    }
  ];

  All ="All / 全部";
  Purchases :any;
  init() {
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getCashFlowList()
        .toPromise()
        .then(
          data => { // Success
            // this.YearLoadSel = false;
            // this.AccountYears = data;        
            
            // this.year_index = this.AccountYears[0];  
            // this.AccountYearChange(this.year_index);
            this.Purchases = data;
            console.log(this.Purchases[0].totalAmount.localeCompare(this.Purchases[1].totalAmount))
            console.log(this.Purchases[1].totalAmount.localeCompare(this.Purchases[0].totalAmount))
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    
  }

  InvoiceType:any;
  invoice_type:any;
  InvoiceTypeLoadSel: boolean = true;
  isModalVisible = false;

  PurchaseItems:any;  
  OldPurchaseItems:any;
  
  paidPurchase(value){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.paidPurchase(this.Purchases[value])
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
  update(value){
    if(document.getElementsByClassName("trDisplayLabel"+value)[0].getAttribute("style")=="display:none"){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.updatePurchase(this.Purchases[value],[],[])
          .toPromise()
          .then(
            res => { // Success
              this.common.createBasicMessage("save successful!!!");
              for(var i = 0 ; i < document.getElementsByClassName("trEditLabel"+value).length ; i++){
                document.getElementsByClassName("trEditLabel"+value)[i].setAttribute("style","display:none");
                document.getElementsByClassName("trDisplayLabel"+value)[i].setAttribute("style","display:");
              }
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });
    }else{    
      for(var i = 0 ; i < document.getElementsByClassName("trEditLabel"+value).length ; i++){
        document.getElementsByClassName("trEditLabel"+value)[i].setAttribute("style","display:");
        document.getElementsByClassName("trDisplayLabel"+value)[i].setAttribute("style","display:none");
      }
    }
    
    
  }

  item_index:any;
  item_code:any;
  item_name:any;
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  headerColumn = ["Product Code / 代号","Quantity / 数量","Unit Cost / 单价","Delete / 删除"];
  purchase_items: any = { "purchase_item": []};

  // InvoiceType_1 : any;
  Purchase:any;
  Suppliers : any;
  Items : any;
  invoicetype_index:any;
  invoicetype_id:any;
  invoicetype:any;
  ssm:any;
  supplier_index :any;
  supplier_id:any;
  supplier_name:any;
  purchase_date : any = new Date().toISOString().split("T")[0];
  invoice_no : any = "";
  particular= "";
  type= "";
  total_amount = "";
  purchase_id:any;
  paid:any;
  reset(){
    this.invoicetype_index=null;
    this.invoicetype_id=null;
    this.invoicetype=null;
    this.purchase_date = new Date().toISOString().split("T")[0];
    this.invoice_no  = "";
    this.particular= "";
    this.type= "";
    this.total_amount = "";
    this.invoicetype_index=null;
    this.invoicetype_id=null;
    this.invoicetype=null;
    this.ssm=null;
    this.supplier_index=null;
    this.supplier_id=null;
    this.supplier_name=null;
    this.purchase_items = { "purchase_item": [],"old_purchase_item":[]};
  }

  savePurchase(){
    let purchase: any = {
      "id":this.purchase_id,
      "supplier":[],
      // "supplier":this.supplier_id,
      "date": this.purchase_date,
      "particular": this.particular,
      "invoiceNo": this.invoice_no,
      "type": {"id":this.invoicetype_id},
      "totalAmount": parseFloat(this.total_amount).toFixed(2)
    }   
    
    let supplier: any = {
      "id":this.supplier_id,
      "contactNo":"",
      "address":"",
      "email":"",
      "website":"",
      "name": this.supplier_name,
      "companyId": this.ssm
    } 
    console.log(this.invoicetype_id);
    if(this.invoicetype_id){
      switch (this.invoicetype_id)
      { 
        case 1:case 2:case 3:
        case 4:case 5:case 6:
        case 7:{
          purchase.supplier = supplier;
          
          let promise = new Promise((resolve, reject) => {
            this.dcrService.updatePurchase(purchase,this.purchase_items.purchase_item,this.purchase_items.old_purchase_item)
              .toPromise()
              .then(
                res => { // Success
                  this.reset();      
            this.common.createBasicMessage("save successful!!!");
                },
                msg => { // Error
                  this.common.createModalMessage(msg.error.error, msg.error.message).error()
                }
              );
          });
          break;
      }
      default:{
        let promise = new Promise((resolve, reject) => {
          this.dcrService.saveAccount(purchase)
            .toPromise()
            .then(
              res => { // Success
                this.reset();      
              this.common.createBasicMessage("save successful!!!");
              },
              msg => { // Error
                this.common.createModalMessage(msg.error.error, msg.error.message).error()
              }
            );
        });
        }
        
      }
    }
    
  }

  nullvalue;

  //upgrade Select data
  ProductLoadSel: boolean = true;
  SupplierLoadSel: boolean = true;
  InvoiceLoadSel: boolean = true;

  ItemChange(value) {

    this.item_code = this.Items[value].product.code;
    // this.item_quantity = this.Items[value].quantity;
    this.item_unit_cost = this.Items[value].product.unitCost;
    
    // this.item_amount:any;
    
    
  }
  Products:any;
  updatePurchaseItem(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.updatePurchaseItem(this.PurchaseItems,this.OldPurchaseItems)
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
    this.isModalVisible = false;
  }
}
