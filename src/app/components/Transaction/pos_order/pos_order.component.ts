import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { DataService } from "../../../services/data.service";
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
import { Sales } from '../../../models/Sales';
import { threadId } from 'worker_threads';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-pos_order',
  templateUrl: './pos_order.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class PosOrderComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
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
  pdfSrc: any;
  ngOnInit(): void {
    this.init();
    window.scrollTo(0, 0);
  }
  
  NoSpoon = false;
  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"
 
  // order_product = ["Code / 代号","QTY / 数量","Total / 卖价", "Remark", "Delete / 删除"];
  // order_product = ["Code / 代号","Unit Price / 单价","QTY / 数量","Total / 卖价", "Remark", "Delete / 删除"];
  order_product = ["Code / 代号","Total / 卖价", "Remark", "Delete / 删除"];

  setOfCheckedId = new Set<number>();
  mainDashboard = true;
  swap(){
    this.mainDashboard = !this.mainDashboard;
    this.reset();
    this.init();
  }
  updateCheckedSet(id: number, checked: boolean): void {
    console.log(this.setOfCheckedId);
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }  
  calPaymentTotal(){
    this.paymentTotal = 0;
    for(var i=0; i < this.order_items.orderItemList.length; i++){
      if(this.setOfCheckedId.has(this.order_items.orderItemList[i].id) && (this.order_items.orderItemList[i].status==null || this.order_items.orderItemList[i].status!='paid')){
        this.paymentTotal = +parseFloat(this.paymentTotal).toFixed(2) + +parseFloat(this.order_items.orderItemList[i].totalPrice).toFixed(2);
      }
    }
    this.paymentTotal = this.paymentTotal.toFixed(2)
    // this.paymentTotal = this.order_items.finalTotal;
  }
  paySplitPaymentTotal(){
    for(var i=0; i < this.order_items.orderItemList.length; i++){
      if(this.setOfCheckedId.has(this.order_items.orderItemList[i].id) && (this.order_items.orderItemList[i].status==null || this.order_items.orderItemList[i].status!='paid')){
        this.order_items.orderItemList[i].status = 'paid'
        this.splitItem(this.order_items.orderItemList[i].id);
      }
    }    
    this.paymentTotal = 0;
    let result = this.order_items.orderItemList.filter((obj) => {
      return obj.status != 'paid';
    });    
  }
  onAllChecked(checked: boolean): void {
    this.order_items.orderItemList
      // .filter(({ disabled }) => !disabled)
      .forEach(({ id }) => this.updateCheckedSet(id, checked));
      this.calPaymentTotal();
    // this.refreshCheckedStatus();
  }

  // onCurrentPageDataChange(listOfCurrentPageData: readonly Data[]): void {
  //   this.listOfCurrentPageData = listOfCurrentPageData;
  //   this.refreshCheckedStatus();
  // }

  // refreshCheckedStatus(): void {
  //   const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
  //   this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
  //   this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  // }

  splitItem(id){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.splitItem(id)
        .toPromise()
        .then(
          res => { // Success
            this.ngOnInit();
            this.common.createBasicMessage("save successful!!!");
            return true;
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            return true;
          }
        );      
    });
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.calPaymentTotal();
    // this.refreshCheckedStatus();
  }
  init() {
    this.date = new Date(new Date().toLocaleString('en', {timeZone: 'Asia/Kuala_Lumpur'})).toISOString().split("T")[0];
    // console.log(
    //   this.date.toLocaleString('en-US', {
    //     timeZone: 'America/New_York',
    //   }),
    // );
    // console.log(
    //   this.date.toLocaleString('en-US', {
    //     timeZone: 'Asia/Kuala_Lumpur',
    //   }),
    // );
    // console.log(new Date().toISOString().split("T")[0]);
    // // console.log(this.date);
    this.getReceiptNo();
    window.scrollTo(0, 0); 
    this.loadAllPosOrder();
    // document.getElementById("itemcode").focus();  
  }
  orders :any;
  async loadAllPosOrder(){
    let data = await this.dataService.loadAllPosOrder();
    if(data){
      console.log(data);
      this.orders =data;
      this.orders.forEach(order => {
        let elements = Array.from(document.querySelectorAll<HTMLElement>('.res-table') ).filter(el => (el.innerHTML.trim() === order.tableNo && order.loaded === true));
        if(elements.length>0){
          elements[0].style.backgroundColor="orangered";
        }
      });      
    }
  }
  date: any;
  ProductLoadSel: boolean = false;
  isModalVisible: boolean = false;
  isOptionGroupMenuVisible: boolean = false;
  isFoodMenuVisible: boolean = false;
  saleType = '4';
  referenceNo:any;
  receiptPrefix = 'KRT';
  Client: any;
  Items : any;
  order_items: any = { "orderItemList": []};
  client_index:any;
  client_name:any;
  client_contact:any;
  client_address:any;
  client_email:any;
  client_shippingAddress:any;
  item_index:any;
  item_code:any;
  item_name:any;
  optionGroups:any = [];
  item_quantity:any = 0;
  item_remark:any;
  item_unit_cost:any = 0.0;
  item_id:any;
  item_amount:any;
  item_sellingPrice:any = 0.0;
  discount:any = 0.0;
  discountCode:any;
  OrderItems:any[] = [];  
  imagefile:any;
  receiptNo:any;
  changes_money:any = 0.0;
  paid_money:any = 0.0;
  itemCount = 0; 
  phoneNo:any = '';
  addItems(product_code,quantity,item_unit_cost,item_sellingPrice){     
    if(this.tableNo === 'Phone' && (this.phoneNo == null || this.phoneNo == '')){
      document.getElementById("phoneNo").focus();   
      return;    
    }   
    if((this.tableNo  === 'Grab' || this.tableNo  === 'FoodPanda') && (this.grabOrderNo == null || this.grabOrderNo == '')){
      document.getElementById("grabOrderNo").focus();   
      return;    
    }
    if(isNaN(this.item_sellingPrice) || this.item_sellingPrice == undefined || this.item_sellingPrice == null|| this.item_sellingPrice == 0){    
      if(this.item_quantity == 0){
        this.item_quantity = 1;
      }
      if(this.item_code==null || this.item_code === ''){
        return;
      }
      if(this.item_code.toUpperCase() != "CASH"){
        this.searchProduct();
      }else{      
        this.item_code = "CASH";
        this.item_name = "CASH";
        this.item_unit_cost = 0.0;
        // document.getElementById("itemPrice").innerHTML = "";
        // document.getElementById("itemPrice").focus(); 
      }    
      document.getElementById("itemcode").focus(); 
      return 
    }
    // ,amount
    for(let i=0;i<this.item_quantity;i++){
      quantity = 1;
      let sellingPrice = parseFloat(item_sellingPrice) / parseInt(this.item_quantity)
      let orderItemList: any = {
        "invoiceId":this.receiptNo,
        "itemName": this.item_name,
        "itemId": product_code,
        "quantity": quantity,
        "unitPrice":item_unit_cost,
        "sellingPrice":sellingPrice,
        "totalPrice":(quantity* item_unit_cost),      
        "remark": this.item_remark,
        "name": this.item_name,      
        "loaded": true,
      }
      if(!this.OrderItems || this.OrderItems.length == 0){
        this.OrderItems = [];
        this.OrderItems.splice(0, 0, orderItemList);
      }
      this.order_items.orderItemList.splice(0, 0, orderItemList);
      
      let ordersInfo = {
        "clientName": this.getTableNo(),
        "cashSalesNo": this.receiptNo,
        "address": this.client_address,
        "contactNo": this.client_contact,
        "email": this.client_email,
        "date": this.date,
        "ringgit": null,
        "cents": null,
        // "subTotal": subTotal,
        // "finalTotal": subTotal,
        "orderItemList": this.order_items.orderItemList
      }
      this.getTotal(ordersInfo,false); 
    }
    this.item_code = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_sellingPrice = null;
    this.item_remark = null;
    this.itemCount = this.itemCount + this.item_quantity;   
    this.item_quantity = 0;
    document.getElementById("itemcode").focus();    
  }
  addOptionItems(product_code,item_quantity,item_unit_cost,item_sellingPrice, item_name, item_remark){     
    if(this.tableNo === 'Phone' && (this.phoneNo == null || this.phoneNo == '')){
      document.getElementById("phoneNo").focus();   
      return;    
    }   
    if((this.tableNo  === 'Grab' || this.tableNo  === 'FoodPanda') && (this.grabOrderNo == null || this.grabOrderNo == '')){
      document.getElementById("grabOrderNo").focus();   
      return;    
    }
    if(isNaN(item_sellingPrice) || item_sellingPrice == undefined || item_sellingPrice == null|| item_sellingPrice == 0){    
      if(item_quantity == 0){
        item_quantity = 1;
      } 
      document.getElementById("itemcode").focus(); 
      return 
    }
    // ,amount
    for(let i=0;i<item_quantity;i++){
      let quantity = 1;      
      let orderItemList: any = {
        "invoiceId":this.receiptNo,
        "itemName": item_name,
        "itemId": product_code,
        "quantity": quantity,
        "unitPrice":item_unit_cost,
        "sellingPrice":item_sellingPrice,
        "totalPrice":(quantity* item_unit_cost),      
        "remark": item_remark,
        "name": item_name,      
        "loaded": true,
      }

      if(!this.OrderItems || this.OrderItems.length == 0){
        this.OrderItems = [];
        this.OrderItems.splice(0, 0, orderItemList);
      }
      this.order_items.orderItemList.splice(0, 0, orderItemList);

      let ordersInfo = {
        "clientName": this.getTableNo(),
        "cashSalesNo": this.receiptNo,
        "address": this.client_address,
        "contactNo": this.client_contact,
        "email": this.client_email,
        "date": this.date,
        "ringgit": null,
        "cents": null,
        // "subTotal": subTotal,
        // "finalTotal": subTotal,
        "orderItemList": this.order_items.orderItemList
      }
      this.getTotal(ordersInfo,false); 
    }
    
    this.itemCount = this.itemCount + item_quantity;
    document.getElementById("itemcode").focus();    
  }
  cancelItem(id,index, quantity){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.cancelOrderItem(id)
        .toPromise()
        .then(
          data => { // Success
            this.deleteItem(index,quantity,true)
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  deleteItem(index, quantity,deleted:any=false){   
    console.log('deleteItem'); 
    console.log(this.OrderItems);
    if(!this.OrderItems || this.OrderItems.length == 0){   
      this.OrderItems = [];   
      this.OrderItems.splice(0, 0, this.order_items.orderItemList);
    }
    this.OrderItems.splice(index,1);
    if(this.OrderItems.length==0){
      this.OrderItems=null;  
    }    
    this.order_items.orderItemList.splice(index,1);
    let ordersInfo = {
      "clientName": this.getTableNo(),
      "cashSalesNo": this.receiptNo,
      "address": this.client_address,
      "contactNo": this.client_contact,
      "email": this.client_email,
      "date": this.date,
      "ringgit": null,
      "cents": null,
      // "subTotal": subTotal,
      // "finalTotal": subTotal,
      "orderItemList": this.order_items.orderItemList
    }
    this.itemCount = this.itemCount - quantity;
    this.getTotal(ordersInfo,false,deleted);
    document.getElementById("itemcode").focus();   
  }

  ItemChange(value) {    
    this.item_code = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.optionGroups = [];
    this.item_code = this.Products[value].id;
    if(this.item_quantity == 0){
      this.item_quantity = 1;
    }
    this.searchProductById();
  }

  paidMoney(){
    if(!this.paid_money){
      return;
    }
    this.changes_money = parseFloat(this.paid_money) - parseFloat(this.total);
    this.changes_money = parseFloat(this.changes_money).toFixed(2);
    this.paid_money = parseFloat(this.paid_money).toFixed(2);
  }
  calTotal(value:any=null){
    this.item_sellingPrice = parseFloat(this.item_unit_cost) * parseInt(this.item_quantity);
    this.item_sellingPrice = parseFloat(this.item_sellingPrice).toFixed(2);
  }

  Products:any;
  searchProductById(){
    if(this.item_code){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getProductbyId(this.item_code, this.getPriceType())
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
                  this.calTotal();
                  // document.getElementById("addItembtn").click(); 
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
  searchPaidOrderByTableNo(tableNo,element){
    if(tableNo){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getPaidOrderByTableNo(tableNo)
          .toPromise()
          .then(
            data => { // Success
              this.order_items = data;
              console.log(this.order_items);
              this.total = this.order_items.finalTotal;
              this.receiptNo = this.order_items.cashSalesNo
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });
      

    }    
  }
  searchOrderByTableNo(tableNo,element){
    if(tableNo){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getOrderByTableNo(tableNo)
          .toPromise()
          .then(
            data => { // Success
              this.order_items = data;
              console.log(this.order_items);
              this.total = this.order_items.finalTotal;
              this.receiptNo = this.order_items.cashSalesNo
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });
      

    }    
  }
  foodMenuLoaded(){
    
  }
  modalLoaded(){
    this.paid = false;
    this.paid_money = null;
    document.getElementById("paidAmount").focus();  
  }
  
  discountVoucher(value){  
  }
  splitPayMode = false;
  splitPay(){   
    let result = this.order_items.orderItemList.filter((obj) => {
      return obj.status != 'paid';
    });
    if(result.length == 1){
      this.setOfCheckedId = new Set<number>();
      document.getElementById("itemcode").focus(); 
      return;
    }
    this.splitPayMode = true;    
    this.selectedSales = {
      "clientName": this.getTableNo(),
      "cashSalesNo": this.receiptNo,
      "address": this.client_address,
      "contactNo": this.client_contact,
      "email": this.client_email,
      "date": this.date,
      "duedate": null,
      "currency": this.paid_money,
      "subTotal": null,
      "paymentType":null,
      "paidAmount": this.paid_money,
      "changes": this.changes_money,
      "finalTotal": this.paymentTotal,
      "type":this.saleType,
      "referenceNo":this.referenceNo,
      "orderItemList": this.order_items.orderItemList,
      "print":false
    } 
    this.isModalVisible = true; 
  }
  
  getTableNo(){    
    let actualTableNo = '';
    if(this.tableNo.includes('Grab')){
      if(this.grabOrderNo !=null && this.grabOrderNo != ''){
        actualTableNo = 'Grab: ' + this.grabOrderNo;
        if(this.NoSpoon){
          actualTableNo += ' - NO SPOON'
        }
      }else{
        actualTableNo = this.tableNo;
      }
      this.saleType = "5";
    } else if(this.tableNo.includes('FoodPanda')){
      if(this.grabOrderNo !=null && this.grabOrderNo != ''){
        actualTableNo = 'FoodPanda: ' + this.grabOrderNo;
        if(this.NoSpoon){
          actualTableNo += ' - NO SPOON'
        }
      }else{
        actualTableNo = this.tableNo;
      }
      this.saleType = "11";
    }else{
      if(this.tableNo.includes('Phone')){        
        if(this.phoneNo !=null && this.phoneNo != ''){
          actualTableNo = 'Phone: ' + this.phoneNo;
        }else{          
          actualTableNo = this.tableNo;
        }
      }else{
        actualTableNo = this.tableNo;
      }
      this.saleType = "4";
    }
    return actualTableNo;
  }
  getPriceType(){
    let priceType = 'SellingPrice';
    if(this.tableNo.includes('Grab') || this.tableNo.includes('FoodPanda')){
      priceType = 'GrabMartPrice';
    }else{
      priceType = 'SellingPrice';
    }
    return priceType;
  }
  selectedSales: Sales 
  kickOpen = false;
  grabOrderNo:any = '';
  InputChange(event){
    if(!this.tableNo){
      return
    }
    if((this.item_code == null || this.item_code == "") && this.paid_money <= 0 && this.total > 0){       
      if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey){
        this.selectedSales = {
          "clientName": this.getTableNo(),
          "cashSalesNo": this.receiptNo,
          "address": this.client_address,
          "contactNo": this.client_contact,
          "email": this.client_email,
          "date": this.date,
          "duedate": null,
          "currency": this.paid_money,
          "subTotal": null,
          "paymentType":null,
          "paidAmount": this.paid_money,
          "changes": this.changes_money,
          "finalTotal": this.total,
          "type":this.saleType,
          "referenceNo":this.referenceNo,
          "orderItemList": this.order_items.orderItemList,
          "print":false
        } 
        if(this.setOfCheckedId.size == 0){
          this.onAllChecked(true);
        }
        this.isModalVisible = true; 
        // this.calPaymentTotal();
      }else{
        this.saveOrder(false);
      }
      return
    } 
    if(this.item_code != null){
      if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey){        
        this.calTotal(null);
        document.getElementById("addItembtn").click(); 
        return;
      }
      if(this.item_code.toUpperCase() == 'OPEN'){
        this.kickOpen = true;
        return;
      }else{
        this.kickOpen = false;
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
      }      
    }
  }
  
  searchProduct(){
    console.log('searchProduct');
    if(this.item_code){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getProductbyCode(this.item_code, true, this.getPriceType())
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
                  this.optionGroups = Product.optionGroup;
                  this.item_quantity = 1;
                  // this.item_unit_cost = Product.unitCost;
                  // document.getElementById("itemquantity").focus();
                  this.calTotal(null);
                  // document.getElementById("addItembtn").click(); 
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
  optionGroup :any[] = [];
  getOptionGroupMenu(data){
    console.log(data)
    this.optionGroup = data;
  }
  addOptionGroup(){
    console.log(this.optionGroup)
    let remark  = '';
    for(let a of this.optionGroup){
      console.log(a)
      if(a.sellingPrice>0){
        this.addOptionItems(a.code,this.item_quantity,0.0,a.sellingPrice,a.name,a.remark)
      }      
      remark += a.code + ",";
    }
    console.log(this.item_code)
    this.item_remark = remark.substring(0,remark.length-1);
    this.addItems(this.item_code,this.item_quantity,this.item_unit_cost,this.item_sellingPrice)
    this.handleOk();
    this.optionGroup = [];
  }
  getFoodMenuSearchValue(data){ 
    this.Products = [data];
    if(this.Products.length>0){
      this.isFoodMenuVisible = false;
      if(this.Products.length==1){
        let Product = this.Products[0];
        this.item_code = Product.code;
        this.item_name = Product.name;
        this.imagefile = Product.image_url;
        this.item_unit_cost = Product.item.sellingPrice;
        this.item_quantity = 1;
        this.calTotal(null);
        // this.item_unit_cost = Product.unitCost;
        // document.getElementById("itemquantity").focus();
        // this.calTotal(null);
        // document.getElementById("addItembtn").click(); 
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
  paymentTotal:any = 0.0;
  getTotal(info,generated,deleted:any=false){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getTotal(info)
        .toPromise()
        .then(
          res => { // Success
            this.total = res['body'];
            this.total = parseFloat(this.total).toFixed(2);            
            if(deleted){
              let promise = new Promise((resolve, reject) => {
                this.dcrService.updateTotalByReceiptNo(this.total,this.receiptNo)
                  .toPromise()
                  .then(
                    data => { // Success
                    },
                    msg => { // Error
                      this.common.createModalMessage(msg.error.error, msg.error.message).error()
                    }
                  );
              });
            }
            if(generated){
              this.paidMoney();
              this.paid = true;
              let param = {
                total: this.total,
                paid_money: this.paid_money,
                changes_money: this.changes_money
              };
              
              this.common.createModalMessageWithParam("Payment Information",null,param).success()  
              this.total = 0.0;   
              this.changes_money = 0.0;
              this.paid_money = 0.0;    
              this.paymentTotal = 0.0; 
            
              this.reset();
              this.printReceiptNo = this.receiptPrefix+this.receiptIndex; 
              // this.receiptIndex++;
              // this.receiptNo =this.receiptPrefix+this.receiptIndex;    
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
    this.OrderItems = [];
    this.client_index=null;
    this.client_name=null;
    this.client_contact=null;
    this.client_address=null;
    this.client_shippingAddress=null;
    this.item_index=null;
    this.item_code=null;
    this.item_name=null;
    this.item_quantity=1;
    this.item_unit_cost=null;
    this.item_amount=null;
    this.imagefile = null;
    // this.orderId = null;
    this.receiptNo = null;
    this.order_items= { "orderItemList": []};
    this.total = 0.0;
    this.paid_money = 0.0;
    this.changes_money = 0.0;
    this.paid = false;
    this.itemCount = 0;
    this.isModalVisible = false;
    this.isFoodMenuVisible = false;
    
    this.client_email = null;
    this.kickOpen = false;
    this.isCreditCard = false;
    this.receiptNo=null;
    this.setOfCheckedId = new Set<number>();
    this.splitPayMode = false;
    this.tableNo='';
    this.grabOrderNo=null;
    this.phoneNo=null;
    this.OrderItems = [];
  }

  paid = false;
  generateReceipt(cashSalesInfo,print, printPrevious:any =false) {
    this.dcrService.serverPrint(cashSalesInfo,'posreceipt', this.receiptPrefix,print,printPrevious);
    if(!printPrevious){
      this.previousSales = cashSalesInfo;
      this.getTotal(cashSalesInfo,true);
      this.handleCancel();
    }
  }
  tableNo :any = '';
  posorder: any;
  selectTable(event) {
    console.log('selectTable');
    this.order_items = { "orderItemList": []};
    this.receiptNo = '';
    if(event.target.classList.contains('res-table')){
      this.reset();
      this.tableNo = event.target.innerHTML;
      var tables = Array.from(document.querySelectorAll<HTMLElement>('.res-table') )
      var len =  tables.length;
      for(var i=0 ; i<len; i++){
        if(tables[i].style.backgroundColor  == "rgb(255, 145, 77)"){
          tables[i].style.backgroundColor="whitesmoke";
        }
      }
      if(event.target.style.backgroundColor=="orangered"){        
        // this.searchOrderByTableNo(this.tableNo,event.target);
        this.searchOrderByTableNo(this.getTableNo(),event.target);        
      }else{
        let elements = Array.from(document.querySelectorAll<HTMLElement>('.res-table') ).filter(el => el.innerHTML.trim() === this.tableNo);
        if(elements.length>0){
          elements[0].style.backgroundColor="rgb(255, 145, 77)";
        }
      }
    }
    document.getElementById("itemcode").focus();  
  }
  loadPOSOrder(event) {
    console.log('selectTable');
    this.order_items = { "orderItemList": []};
    this.receiptNo = '';
    if(event.target.classList.contains('res-table')){
      this.reset();
      this.tableNo = event.target.innerHTML;
      var tables = Array.from(document.querySelectorAll<HTMLElement>('.res-table') )
      var len =  tables.length;
      for(var i=0 ; i<len; i++){
        if(tables[i].style.backgroundColor  == "rgb(255, 145, 77)"){
          tables[i].style.backgroundColor="whitesmoke";
        }
      }
      this.searchPaidOrderByTableNo(this.getTableNo(),event.target);  
    }
    document.getElementById("itemcode").focus();  
  }
  printReceiptNo;
  previousSales;
  printReceipt(){
    this.previousSales.cashSalesNo = this.printReceiptNo;
    this.generateReceipt(this.previousSales,true,true);
  }
  loadFoodMenuModal(){
    this.isFoodMenuVisible = true;
  }
  loadOptionModal(){
    this.isOptionGroupMenuVisible = true;
  }  
  handleOk(): void {
    if(this.paid_money >= 0 ){
      if(this.changes_money >= 0 ){
        window.scrollTo(0, 0)
        this.isModalVisible = false;
      }
    }
    this.isFoodMenuVisible = false;
    this.isOptionGroupMenuVisible = false;
  }
  
  handleCancel(): void {
    window.scrollTo(0, 0)
    let elements = Array.from(document.querySelectorAll('.restable')).filter(el => el.innerHTML.trim() === this.tableNo);
    console.log(elements);
    // elements.forEach(el => el.style.backgroundColor = 'whitesmoke');
    // document.getElementsByClassName('restable').stream().
    this.isModalVisible = false;
    this.isVisible = false;
    this.item_code =null;
    this.optionGroups = [];
    this.isCreditCard = false;
    this.isFoodMenuVisible = false;
    this.isOptionGroupMenuVisible = false;
  }

  autopopulate() {
    this.paid_money = this.total;
    document.getElementById("paidAmount").focus();  
  }
  isCreditCard = false;
  creditCard() {
    this.paid_money = this.total;
    this.isCreditCard = true;
  }
  getSalesDetail(sales){   
    console.log('saveSales'+sales); 
    this.total = sales.finalTotal;
    this.paid_money = sales.paidAmount;
    this.changes_money = sales.changes;
    let print = sales.print;
    sales.orderItemList = this.order_items.orderItemList;
    this.isVisible = true;
    if(!this.splitPayMode){
      this.generateReceipt(sales,print);
      let elements = Array.from(document.querySelectorAll<HTMLElement>('.res-table') ).filter(el => el.innerHTML.trim() === this.tableNo);
      if(elements.length>0){
        elements[0].style.backgroundColor="whitesmoke";
      }      
      if(this.tableNo.includes('Phone')){        
        elements[0].parentElement.remove()
      }
    } else {      
      this.isVisible = false;
      this.paySplitPaymentTotal();
      // this.total = parseFloat(this.paymentTotal).toFixed(2);
      // this.paidMoney();
      this.setOfCheckedId  = new Set<number>();
      this.paid = true;
      let param = {
        total: sales.finalTotal,
        paid_money: sales.paidAmount,
        changes_money: sales.changes
      };
      
      this.common.createModalMessageWithParam("Payment Information",null,param).success()  
      // this.total = 0.0;   
      // this.changes_money = 0.0;
      // this.paid_money = 0.0;    
      // this.paymentTotal = 0.0; 
        
      this.splitPayMode = false;
      this.reset();
    }
  }

  saveOrder(print){
    if(isNaN(this.total) || this.total != undefined || this.total != null){
      let sales: any = {
        "clientName": this.getTableNo(),
        "cashSalesNo": this.receiptNo,
        "address": this.client_address,
        "contactNo": this.client_contact,
        "email": this.client_email,
        "date": this.date,
        "duedate": null,
        "currency": this.paid_money,
        "subTotal": null,
        "paidAmount": this.paid_money,
        "changes": this.changes_money,
        "finalTotal": this.total,
        "type":this.saleType,
        "referenceNo":this.referenceNo,
        "orderItemList": this.order_items.orderItemList
      } 

      this.dcrService.serverPrint(sales,'posorder', this.receiptPrefix,print,false);
      this.order_items.orderItemList.forEach(e => e.loaded =false)
      this.OrderItems = [];
      // this.generateReceipt(sales,print);
      if(!this.getTableNo().includes("Grab")&&!this.getTableNo().includes("Phone")&&!this.getTableNo().includes("FoodPanda")){
        let elements = Array.from(document.querySelectorAll<HTMLElement>('.res-table') ).filter(el => el.innerHTML.trim() === this.tableNo);
        if(elements.length>0){
          elements[0].style.backgroundColor="orangered";
        }
      }
      this.reset();
    } else{
      document.getElementById("paidAmount").focus();  
    } 
  }
    

}
