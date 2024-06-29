import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Console } from 'console';


@Component({
  selector: 'app-stock_check',
  templateUrl: './stock_check.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class StockCheckListComponent implements OnInit {
  ShowColumnData: any[];
  ShowColumn: string[] = [];
  tableShowOverflow: string;
  selproductWid: string; tableShowWid: string;
  left: boolean = false;

  tableTdWords = [, 'Compatible', 'Incompatible', 'Compatible: Not Tested', 'Not Supported'];
  readonly statusCls: string[] = ["", "tdCompatible", "tdIncompatible", "tdCompatibleNT", "tdNotSupport"];
  readonly statusInfoCls: string[] = ["", "tdCompatibleinfo", "tdIncompatibleinfo", "tdCompatibleNTinfo", "tdNotSupportinfo"];

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
  tooltipOne: string[];
  tooltipTwo: string[];
  ngOnInit(): void {
    this.selproductWid = "300px";
    this.tableShowWid = ""
    //table
    this.init();

    
    
  }

  ngAfterContentInit() {
   
    }


  //pack up 
  widchange() {

    this.left = !this.left;
    this.selproductWid = this.left ? "25px" : "300px";
    this.tableShowWid = "";

  }


  

  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"
 

  unCheck(value) {
    if (value.length == 1) {
      this.ShowColumnData.forEach(r => {
        if (value[0].id == r.id) {
          r.disabled = true;
          r.checked = true;
        } else {
          r.disabled = false;
          r.checked = false
        }
      })
    } else {
      this.ShowColumnData.forEach(r => {
        r.disabled = false
      })
    }
    this.ShowColumn = [];
    value.forEach(r => {
      this.ShowColumn.push(r.id)
    })
   
  }

  clearTableData() {
    
  }

  productListData: any[];
  productName: string;
  // columnData: { name?: "", upgradeProducts?: { releases: [] } } = { name: "", "upgradeProducts": { "releases": [] } };
  columnData: any[];
  column: any[];
  headerName: any[];
  headerNameArr: any[];
  rowLen: number;
  tableEmpty: boolean = true;
  

  //select mock data
  SelListModal: any = { "ProductData": [], "selectedPro": "" };

  

  //change class
  displayStatus(status: number, note: string, rowChildRelease): string {
    let cls = (!rowChildRelease.techGuided || !rowChildRelease.genGuided) ? ' trSupp' : " ";
    return note == null || note == "" ? `${this.statusCls[status]} + ${cls}` : `${this.statusInfoCls[status]} + ${cls}`;
    // return note == null || note == "" ? this.statusCls[status] : this.statusInfoCls[status]

  }

  //copy
  copyType: string = "none";
  copyMessage;
  copyClick() {
    this.copyType = "block";
    this.common.createModalMessage("Info", 'Copy to Clipboard').success();
    setTimeout(() => {
      console.log(this.copyMessage);
      this.message.remove(this.copyMessage);
      this.common.copy("UpgradePrint")
      this.copyType = "none"
    }, 1)
  }

  //csv
  CSVlink() {
    this.common.csv("UpgradePrint", "Upgrade")
  }

  //print
  printLink() {
    
    
  }

  formatTime(min) {
    return moment(min).format('yyyy-MM-DD')
  }

  @HostListener('window:scroll', ['$event'])
  scrollTop: number = 0;
  onScroll(s) {
    // let st = s.target;
    // let f: any = document.getElementsByClassName('ph-footer');
    // if (st.scrollHeight == st.clientHeight + st.scrollTop && st.scrollHeight != st.clientHeight) {
    //   console.log(st.scrollTop);
    //   // console.log(st.clientHeight);
    //   // console.log(st.scrollHeight);
    //   this.scrollTop == 0 ? this.scrollTop = st.scrollTop : "";
    //   this.elementRef.nativeElement.querySelector('.contain-inter').style.height = "calc(100vh - 230px)";
    //   f[0].style.display = "block";
    // } else if (this.scrollTop > st.scrollTop) {
    //   this.elementRef.nativeElement.querySelector('.contain-inter').style.height = "calc(100vh - 142px)";
    //   f[0].style.display = "none";
    // }
  }

  //highLight
  tdSelected: any;
  tdMouseOver(i) {
    this.tdSelected = i;
  }

  tdMouseOut() {
    this.tdSelected = "131355";
  }

  item_index:any;
  item_code:any;
  item_name:any;
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  addItems(product_code,quantity,unit_cost,total_amount){
    // ,amount
    let stockCheck: any = {
      "date": this.purchase_date,
      "productId": product_code,
      "quantity": quantity,
      "unitCost": unit_cost,
      "total": parseFloat(total_amount).toFixed(2)
    } 
    var found = false;
    for(var i = 0; i < this.stockChecks.stockCheck.length; i++) {
        if (this.stockChecks.stockCheck[i].productId == stockCheck.productId) {            
            this.stockChecks.stockCheck[i].quantity = parseInt(this.stockChecks.stockCheck[i].quantity) + parseInt(stockCheck.quantity);
            this.stockChecks.stockCheck[i].total = parseInt(this.stockChecks.stockCheck[i].quantity) * parseFloat(this.stockChecks.stockCheck[i].unitCost);
            this.stockChecks.stockCheck[i].total = parseFloat(this.stockChecks.stockCheck[i].total).toFixed(2);
            found = true;
            break;
        }
    }
    if(!found){
      this.stockChecks.stockCheck.push(stockCheck);
    }
    
    
    this.item_index =null;
    this.item_code =null;
    this.item_name =null;
    this.item_unit_cost = null;
    this.item_quantity = null;
    this.imagefile = null;
    document.getElementById("itemcode").focus();
  }

  amountChange(value){
    this.total_amount = parseFloat(this.total_amount).toFixed(2);
  }
  deleteItem(index){
    this.stockChecks.stockCheck.splice(index,1);
  }
  // headerColumn = ["Product Code / 代号","Quantity / 数量","Stock Tick Quantity / Stock Stick 数量","Unit Cost / 单价","Total Value / 货价","Delete / 删除"];
  headerColumn = ["Product Code / 代号","Quantity / 数量", "Unit Cost / 单价","Total Value / 货价","Delete / 删除"];
  stockChecks: any = { "stockCheck": []};

  InvoiceType : any;
  Suppliers : any;
  Items : any;
  invoicetype_index:any;
  invoicetype_id:any;
  invoicetype:any;
  ssm:any;
  supplier_index :any;
  supplier_id:any;
  supplier_name:any;
  purchase_date = new Date().toISOString().split("T")[0];
  invoice_no : any = "";
  particular= "";
  type= "";
  total_amount:any;
  total_stock_value:any = "0.0";
  stock_check_total_stock_value:any = "0.0";
  reset(){
    this.invoicetype_index=null;
    this.invoicetype_id=null;
    this.invoicetype=null;
    this.purchase_date = new Date().toISOString().split("T")[0];
    this.invoice_no  = "";
    this.particular= "";
    this.type= "";
    this.total_amount=null;
    this.invoicetype_index=null;
    this.invoicetype_id=null;
    this.invoicetype=null;
    this.ssm=null;
    this.supplier_index=null;
    this.supplier_id=null;
    this.supplier_name=null;
    this.stockChecks = { "stockCheck": []};
  }

  YearLoadSel: boolean = true;
  AccountYears: any;
  year_index: any;
  month_index:any;
  StockCheckDate: any;
  StockCheckListing: any;
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
  AccountMonthChange(value){
    console.log(value);
    console.log(this.month_index);
    if(this.year_index){      
      this.AccountYearChange(this.year_index);
    }
  }
  AccountYearChange(value){
    this.dcrService.getStockCheckDate(value,this.month_index).subscribe(data => {
      this.purchase_date = null;
      this.StockCheckDate = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }
  stockCheckListing(value){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getStockCheckListing(value)
        .toPromise()
        .then(
          data => { // Success
            console.log(data);
            this.StockCheckListing = data["body"];
            
            // this.reset();
            // this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    
  }

  ProductCheck: any;
  runCheckStock(){     

    let promise = new Promise((resolve, reject) => {
      this.dcrService.runCheckStock(this.purchase_date)
        .toPromise()
        .then(
          data => { // Success
            this.ProductCheck = data["body"];
            for(let i =0;i<this.ProductCheck.length;i++){
              if(this.ProductCheck[i].stock>0){
                this.total_stock_value = parseFloat(this.total_stock_value) + parseFloat(this.ProductCheck[i].total_stock);
                this.ProductCheck[i].total_stock = parseFloat(this.ProductCheck[i].total_stock).toFixed(2);
                this.total_stock_value = parseFloat(this.total_stock_value).toFixed(2)
              }
              if(this.ProductCheck[i].stockcheck && this.ProductCheck[i].stockcheck.quantity >0){
                this.stock_check_total_stock_value = parseFloat(this.stock_check_total_stock_value) + parseFloat(this.ProductCheck[i].stockcheck.total);
                this.stock_check_total_stock_value = parseFloat(this.stock_check_total_stock_value).toFixed(2);
              }
              
            }
            
            // this.reset();
            // this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    
  }

  nullvalue;
  saveSupplier(){
    let supplier: any = {
      "contactNo": this.nullvalue,
      "address": this.nullvalue,
      "email": this.nullvalue,
      "website": this.nullvalue,
      "name": this.supplier_name,
      "companyId": this.ssm
    } 
    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveSupplier(supplier)
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

  InvoiceTypeChange(value){
    this.invoicetype_id = this.InvoiceType[value].id;
    this.invoicetype = this.InvoiceType[value].description;

  }

  SupplierChange(value){
    this.supplier_id = this.Suppliers[value].id;
    this.ssm = this.Suppliers[value].companyId;
    this.supplier_name = this.Suppliers[value].name;

  }

  //upgrade Select data
  ProductLoadSel: boolean = true;
  SupplierLoadSel: boolean = true;
  InvoiceLoadSel: boolean = true;
  init() {
    let d = new Date();
    this.purchase_date = new Date().toISOString().split("T")[0];
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getAccountYear()
        .toPromise()
        .then(
          data => { // Success
            this.YearLoadSel = false;
            this.AccountYears = data;        
            
            this.year_index = this.AccountYears[0];  
            // this.AccountYearChange(this.year_index);
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    
  }

  calStockTotalStock(e){
    this.ProductCheck[e].stockcheck.total = (parseFloat(this.ProductCheck[e].stockcheck.unitCost) * parseInt(this.ProductCheck[e].stockcheck.quantity)).toFixed(2)
    console.log(this.ProductCheck[e]);
  }

  calTotalStock(e){
    this.ProductCheck[e].total_stock = (parseFloat(this.ProductCheck[e].unit_cost) * parseInt(this.ProductCheck[e].stock)).toFixed(2)
    console.log(this.ProductCheck[e]);
  }

  update(value){
    if(document.getElementsByClassName("trDisplayLabel"+value)[0].getAttribute("style")=="display:none"){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.quickUploadProductStock(this.ProductCheck[value])
          .toPromise()
          .then(
            res => { // Success
              this.dcrService.stockCheck(this.ProductCheck[value].stockcheck)
              .toPromise()
              .then(
                res => { // Success
                  for(var i = 0 ; i < document.getElementsByClassName("trEditLabel"+value).length ; i++){
                    document.getElementsByClassName("trEditLabel"+value)[i].setAttribute("style","display:none");
                    document.getElementsByClassName("trDisplayLabel"+value)[i].setAttribute("style","display:");
                  }
                  this.common.createBasicMessage("save successful!!!");
                },
                msg => { // Error
                  this.common.createModalMessage(msg.error.error, msg.error.message).error()
                }
              );
              // for(var i = 0 ; i < document.getElementsByClassName("trEditLabel"+value).length ; i++){
              //   document.getElementsByClassName("trEditLabel"+value)[i].setAttribute("style","display:none");
              //   document.getElementsByClassName("trDisplayLabel"+value)[i].setAttribute("style","display:");
              // }
              // this.common.createBasicMessage("save successful!!!");
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
  imagefile :any;
  formatImage(img: any): any {
    if(img){
      return this.common.formatImage(img);
    }
  }

  qtyChange(value){
    this.total_amount = this.item_quantity * this.item_unit_cost;
    this.addItems(this.item_code,this.item_quantity,this.item_unit_cost,this.total_amount)
  }
  InputChange(value){
    this.item_index =null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.searchProduct();
  }

  ItemChange(value) {
    this.item_code = this.Items[value].code;
    this.searchProduct();
  }

  Products:any;
  searchProduct(){
    if(this.item_code){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getProductbyCode(this.item_code)
          .toPromise()
          .then(
            data => { // Success
              this.Products = data;
              if(this.Products.length>0){
                if(this.Products.length==1){
                  let Product = this.Products[0];
                  this.item_code = Product.id;
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;
                  this.item_unit_cost = Product.unitCost;
                  document.getElementById("itemquantity").focus();
                }else{            
                  this.ProductLoadSel = false;
                  document.getElementById("productItems").getElementsByTagName('input')[0].click();
                }
              }else{
                this.item_code = null;
                this.item_unit_cost = null;
                this.item_name = null;
                this.imagefile = null;
                this.common.createModalMessage("Failed","No Product Found").error();
              }
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });
      

    }    
  }
}
