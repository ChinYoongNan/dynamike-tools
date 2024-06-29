import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { CommonDynamikeService } from "../../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AppComponent } from '../../../app.component';
import { ignoreElements } from 'rxjs-compat/operator/ignoreElements';
import { NzModalService } from 'ng-zorro-antd/modal';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Sales } from '../../../models/Sales';
@Component({
  selector: 'app-shop_add',
  templateUrl: './shop_add.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class ShopAddComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private commonDynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private appcomponent: AppComponent,
    private modalService: NzModalService
  ) {
  }
  ngOnInit(): void {
    this.init();
    window.scrollTo(0, 0);
  }
  

  isVisible: boolean = false;
  NoResultId = "No Data"

  scrollTop: number = 0;
  order_product = ["Product Code / 代号","Unit Price / 单价","Quantity / 数量","Selling Price / 卖价","Delete / 删除"];
  pageTitle = 'Cashier';

  changeToStall(){
    this.stallConfig()
    this.getReceiptNo();
  }
  stallConfig(){    
    this.pageTitle = 'Cashier - 小吃部';
    this.saleType = '14';
    this.paymentType='3';
    this.receiptPrefix = 'KPS';
    this.priceType = "SellingPrice"
  }
  shopConfig(){    
    this.pageTitle = 'Cashier';
    this.saleType = '1';
    this.paymentType='1';
    this.receiptPrefix = 'KPR';
    this.priceType = "SellingPrice"
  }
  grabMartConfig(){
    this.pageTitle = 'Grab Mart';
    this.saleType = '3';
    this.paymentType='3';
    this.receiptPrefix='GRM';
    this.priceType = "GrabMartPrice"
  }
  init() {
    this.shopConfig();
    let d = new Date();
    this.date = new Date().toISOString().split("T")[0];
    this.getReceiptNo();
    window.scrollTo(0, 0); 
    document.getElementById("itemcode").focus();  
  }
  date: any;
  ProductLoadSel: boolean = false;
  isModalVisible: boolean = false;
  saleType = '1';
  paymentType='1';
  referenceNo:any;
  receiptPrefix = 'KPR';
  Client: any;
  Items : any;
  order_items: any = { "order_item": []};
  client_index:any;
  client_name:any;
  client_contact:any;
  client_address:any;
  client_email:any;
  client_shippingAddress:any;
  item_index:any;
  item_code:any;
  item_name:any;
  item_quantity:any = 0;
  item_unit_cost:any = 0.0;
  item_id:any;
  item_amount:any;
  item_sellingPrice:any = 0.0;
  discount:any = 0.0;
  discountCode:any;
  OrderItems:any[];  
  imagefile:any;
  receiptNo:any;
  changes_money:any = 0.0;
  paid_money:any = 0.0;
  itemCount = 0; 
  addItems(product_code,quantity,item_unit_cost,item_sellingPrice){
    if(isNaN(this.item_sellingPrice) || this.item_sellingPrice == undefined || this.item_sellingPrice == null|| this.item_sellingPrice == 0){    
      document.getElementById("itemcode").focus(); 
      this.common.createModalMessage("Invalid", "This Product is invalid for checkout").error()
      return 
    }
    // ,amount
    let order_item: any = {
      "invoiceId":this.receiptNo,
      "itemName": this.item_name,
      "itemId": product_code,
      "quantity": quantity,
      "unitPrice":item_unit_cost,
      "sellingPrice":item_sellingPrice,
      "totalPrice":(quantity* item_unit_cost),      
      "name": this.item_name,
    }
    if(!this.OrderItems){
      this.OrderItems = [];
      this.OrderItems.splice(0, 0, order_item);
    }
    let found = false;
    for(var i = 0; i < this.order_items.order_item.length; i++) {
      if(product_code != "CASH"){
        if (this.order_items.order_item[i].itemId == product_code) {            
            this.order_items.order_item[i].quantity = parseInt(this.order_items.order_item[i].quantity) + parseInt(quantity);
            this.order_items.order_item[i].totalPrice = parseInt(this.order_items.order_item[i].quantity) * parseFloat(this.order_items.order_item[i].unitPrice);
            this.order_items.order_item[i].totalPrice = parseFloat(this.order_items.order_item[i].totalPrice).toFixed(2);
            this.order_items.order_item[i].sellingPrice = parseFloat(this.order_items.order_item[i].totalPrice).toFixed(2);
            found = true;
            break;
        }
      }else{
        if (this.order_items.order_item[i].itemId == product_code && this.order_items.order_item[i].unitPrice == item_unit_cost) {            
          this.order_items.order_item[i].quantity = parseInt(this.order_items.order_item[i].quantity) + parseInt(quantity);
          this.order_items.order_item[i].totalPrice = parseInt(this.order_items.order_item[i].quantity) * parseFloat(this.order_items.order_item[i].unitPrice);
          this.order_items.order_item[i].totalPrice = parseFloat(this.order_items.order_item[i].totalPrice).toFixed(2);
          this.order_items.order_item[i].sellingPrice = parseFloat(this.order_items.order_item[i].totalPrice).toFixed(2);
          found = true;
          break;
        }
      }
    }
    if(!found){
      // this.order_items.order_item.push(order_item);
      this.order_items.order_item.splice(0, 0, order_item);
    }
    this.item_code = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_sellingPrice = null;
    let ordersInfo;
    if(this.shop){
      ordersInfo = {
        "clientName": this.client_name,
        // "cashSalesNo": this.receiptNo,
        "address": this.client_address,
        "contactNo": this.client_contact,
        "email": this.client_email,
        "date": this.date,
        "ringgit": null,
        "cents": null,
        // "subTotal": subTotal,
        // "finalTotal": subTotal,
        "orderItemList": this.order_items.order_item
      }
    }else{
      ordersInfo = {
        "clientName": this.client_name,
        "cashSalesNo": this.receiptNo,
        "address": this.client_address,
        "contactNo": this.client_contact,
        "email": this.client_email,
        "date": this.date,
        "ringgit": null,
        "cents": null,
        // "subTotal": subTotal,
        // "finalTotal": subTotal,
        "orderItemList": this.order_items.order_item
      }
    }
    this.itemCount = this.itemCount + this.item_quantity;
    this.getTotal(ordersInfo,false);
    this.item_quantity = 0;
    document.getElementById("itemcode").focus();    
  }
  
  deleteItem(index, quantity){    
    this.OrderItems.splice(index,1);
    if(this.OrderItems.length==0){
      this.OrderItems=null;  
    }    
    this.order_items.order_item.splice(index,1);
    let ordersInfo = {
      "clientName": this.client_name,
      "cashSalesNo": this.receiptNo,
      "address": this.client_address,
      "contactNo": this.client_contact,
      "email": this.client_email,
      "date": this.date,
      "ringgit": null,
      "cents": null,
      // "subTotal": subTotal,
      // "finalTotal": subTotal,
      "orderItemList": this.order_items.order_item
    }
    this.itemCount = this.itemCount - quantity;
    this.getTotal(ordersInfo,false);
    document.getElementById("itemcode").focus();   
  }

  ItemChange(value) {    
    this.item_code = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_code = this.Products[value].id;
    if(this.item_quantity == 0){
      this.item_quantity = 1;
    }
    this.searchProductById();
  }

  paidMoney(){
    this.changes_money = parseFloat(this.paid_money) - parseFloat(this.total);
    this.changes_money = parseFloat(this.changes_money).toFixed(2);
    this.paid_money = parseFloat(this.paid_money).toFixed(2);
  }
  calTotal(value){
    this.item_sellingPrice = parseFloat(this.item_unit_cost) * parseInt(this.item_quantity);
    this.item_sellingPrice = parseFloat(this.item_sellingPrice).toFixed(2);
  }

  Products:any;
  searchProductById(){
    if(this.item_code){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getProductbyId(this.item_code,this.priceType)
          .toPromise()
          .then(
            data => { // Success
              this.Products = data;
              if(this.Products.length>0){
                if(this.Products.length==1){
                  let Product = this.Products[0];
                  this.item_code = Product.code;
                  this.item_id = Product.id;
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;                  
                  this.item_unit_cost = Product.item.sellingPrice;
                  // this.item_unit_cost = Product.unitCost;
                  // document.getElementById("itemquantity").focus();
                  this.calTotal(null);
                  document.getElementById("addItembtn").click(); 
                }else{            
                  this.ProductLoadSel = false;
                  // this.Items = data;
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

  kickOpen = false;
  InputChange(event){
    if((this.item_code == null || this.item_code == "") && this.paid_money <= 0 && this.total > 0){       
      if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey){
        this.isModalVisible = true; 
        
        this.selectedSales = {
          "clientName": this.client_name,
          "cashSalesNo": this.receiptNo,
          "address": this.client_address,
          "contactNo": this.client_contact,
          "email": this.client_email,
          "date": this.common.formatDateZone(this.date),
          "duedate": null,
          "currency": this.paid_money,
          "subTotal": null,
          "paidAmount": this.paid_money,
          "changes": this.changes_money,
          "finalTotal": this.total,
          "type":this.saleType,
          "paymentType":this.paymentType,
          "referenceNo":this.referenceNo,
          "orderItemList": this.order_items.order_item,
          "print":false
        } 
      }
      return
    } 
    this.searchAndAdd();
    
  }
  searchAndAdd(keyboard:any=true){
      if(!keyboard){
        if((this.item_code == null || this.item_code == "") && this.paid_money <= 0 && this.total > 0){ 
          this.isModalVisible = true;
          return
        }  
      }
    
    if(this.shop){
      if(this.item_code.toUpperCase() == 'OPEN'){
        this.kickOpen = true;
        return;
      }else{
        this.kickOpen = false;
      }
    }   
    this.paid = false;
    this.item_sellingPrice = null;
    this.item_index =null;
    this.item_unit_cost = null;
    this.item_name = null;
    if(this.item_quantity == 0){
      this.item_quantity = 1;
    }
    if(this.item_code.toUpperCase() != "CASH"){
      this.searchProduct();
    }else{      
      this.item_code = "CASH";
      this.item_name = "CASH";
      this.item_unit_cost = 0.0;
      document.getElementById("itemPrice").innerHTML = "";
      document.getElementById("itemPrice").focus(); 
      document.getElementById("itemPrice").focus(); 
    }
  }
  
  searchProduct(){
    if(this.item_code){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getProductbyCode(this.item_code, true,this.priceType)
          .toPromise()
          .then(
            data => { // Success
              this.Products = data;
              if(this.Products.length>0){
                if(this.Products.length==1){
                  let Product = this.Products[0];
                  this.item_code = Product.code;
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;
                  this.item_unit_cost = Product.item.sellingPrice;
                  // this.item_unit_cost = Product.unitCost;
                  // // document.getElementById("itemquantity").focus();
                  // for(let p = 0 ; p < Product.items.length ; p++){
                  //   if(Product.items[p]['priceType'] === 'GrabMartPrice'){
                  //     this.item_unit_cost = Product.items[p].sellingPrice;
                  //   }
                  // }
                  this.calTotal(null);
                  document.getElementById("addItembtn").click(); 
                }else{            
                  this.ProductLoadSel = false;
                  this.Items = data;
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
              this.item_code = null;
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });
    }
  }

  addItemListEvent(){
    document.getElementById("addItembtn").click();    
  }

  receiptIndex: any;
  getReceiptNo(){
    this.dcrService.getReceiptNo().subscribe(data => {
      this.receiptNo =this.receiptPrefix+data;
      this.receiptIndex = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }
  
  total:any = 0.0;
  getTotal(info,generated){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getTotal(info)
        .toPromise()
        .then(
          res => { // Success
            this.total = res['body'];
            this.total = parseFloat(this.total).toFixed(2);
            if(generated){
              if(this.shop){                
                if(!this.paid_money || isNaN(this.paid_money)){                
                    this.paid_money = this.total;
                }
              }
              this.paidMoney();
              this.paid = true;
              let param = {
                total: this.total,
                paid_money: this.paid_money,
                changes_money: this.changes_money
              };
              
              if(this.shop){  
                this.common.createModalMessageWithParam("Payment Information",null,param).success()                  
              }else{
                this.total = 0.0;   
                this.changes_money = 0.0;
                this.paid_money = 0.0;     
              }
            
              this.reset();
              this.printReceiptNo = this.receiptPrefix+this.receiptIndex; 
              this.receiptIndex++;
              this.receiptNo =this.receiptPrefix+this.receiptIndex;    
            }
          },
          msg => { // Error
            // this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
          
    });
    
  }
  

  reset(){
    this.item_sellingPrice = null;
    this.OrderItems = null;
    this.client_index=null;
    this.client_name=null;
    this.client_contact=null;
    this.client_address=null;
    this.client_shippingAddress=null;
    this.item_index=null;
    this.item_code=null;
    this.item_name=null;
    this.item_quantity=0;
    this.item_unit_cost=null;
    this.item_amount=null;
    this.imagefile = null;
    // this.orderId = null;
    this.receiptNo = null;
    this.order_items= { "order_item": []};
    this.total = 0.0;
    // this.paid_money = 0.0;
    this.paid_money = null
    this.changes_money = 0.0;
    this.paid = false;
    this.itemCount = 0;
    this.isModalVisible = false;
    
    this.client_email = null;
    this.kickOpen = false;
    this.receiptNo=null;
  }

  paid = false;
  generateReceipt(cashSalesInfo,print, printPrevious:any =false) {
      this.dcrService.serverPrint(cashSalesInfo,'receipt', this.receiptPrefix,print,printPrevious);
      if(!printPrevious){
        this.previousSales = cashSalesInfo;
        this.getTotal(cashSalesInfo,true);
      }
  }
  shop = true;
  priceType='SellingPrice';
  swap() {
    // this.router.navigate(['/ShopAdd']);
    this.shop=!this.shop;
    if(this.shop){
      this.shopConfig();
    }else{
      this.grabMartConfig();
    }
    this.getReceiptNo();
  }
  printReceiptNo;
  previousSales;
  printReceipt(){
    if(this.shop){
      this.previousSales.cashSalesNo = this.previousSales.orderItemList[0].invoiceId;
      this.generateReceipt(this.previousSales,true,true);
    }else{
      this.generateReceipt(this.previousSales,true);
      // this.dcrService.printReceipt(this.printReceiptNo)
    }
  }
  selectedSales: Sales ;
  getSalesDetail(sales){    
    console.log('getSalesDetail')
    console.log(this.order_items);
    this.total = sales.finalTotal;
    this.paid_money = sales.paidAmount;
    this.changes_money = sales.changes;
    let print = false;
    sales.orderItemList = this.order_items.order_item;
     
    if(this.shop){
      sales.cashSalesNo = '';
      // this.isVisible = true;
    }
    this.generateReceipt(sales,print);
    try{
      document.getElementById("kickOpenDrawer").click();
    }catch(e){

    }
  }
    

}
