import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { interval, Subscription } from 'rxjs';
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
// import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-kitchen_dashboard',
  templateUrl: './kitchen_dashboard.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class KitchenDashboardComponent implements OnInit {
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
  }
  

  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"
 
  order_product = ["Code / 代号","Unit Price / 单价","QTY / 数量","Total / 卖价","Delete / 删除"];

  objConfirm = {
    id:null,
    itemId:null,
    name:null,
    quantity:null
  };
  handledItem(id,objParent,obj){
    this.isModalVisible = true;
    this.objConfirm = obj;
  }
  confirmDone(id,objParent,obj){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.handledItem(id)
        .toPromise()
        .then(
          res => { // Success
            this.loadAllPosOrder();
            this.common.createBasicMessage("save successful!!!");
            return true;
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            return true;
          }
        );      
    });
    this.isModalVisible = false;

  }
  noticationSoundPlay(){
    let notication = new Audio();
    notication.src = "../../../../assets/pristine-609.mp3";
    notication.load();
    notication.play();
  }
  init() {
    let d = new Date();
    this.date = new Date().toISOString().split("T")[0];
    this.getReceiptNo();
    window.scrollTo(0, 0); 
    this.silentWorker();
    document.getElementById("itemcode").focus();  
  }  
  ngOnDestroy() {
    if(this.slientworker){
      this.slientworker.unsubscribe();
    }
  }
  slientworker:any;
  orders :any;  
  silentWorker(){
    this.slientworker = interval(8000).subscribe((func => {
      this.loadAllPosOrder(true);
    }))
  }
  async loadAllPosOrder(sound: boolean = false){
    let data = await this.dataService.loadAllPosOrder();
    if(data){   
      this.orders =data; 
      if(this.orders.length>0){
        const incompletedOrder = this.orders.map(function(r) {
          r.orderItemList = r.orderItemList.filter(x => x.status != "done");
          return r;
        }).filter(({ orderItemList }) => orderItemList.length);
        if(incompletedOrder.length >0 && sound){
          this.noticationSoundPlay();
        }
      }     
    }
  }
  date: any;
  ProductLoadSel: boolean = false;
  isModalVisible: boolean = false;
  isOrderModalVisible: boolean = false;
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
      return 
    }
    // ,amount
    let orderItemList: any = {
      "invoiceId":this.receiptNo,
      "itemName": this.item_name,
      "itemId": product_code,
      "quantity": quantity,
      "unitPrice":item_unit_cost,
      "sellingPrice":item_sellingPrice,
      "totalPrice":(quantity* item_unit_cost),      
      "name": this.item_name,      
      "loaded": true,
    }
    if(!this.OrderItems){
      this.OrderItems = [];
      this.OrderItems.splice(0, 0, orderItemList);
    }
    // let found = false;
    // for(var i = 0; i < this.order_items.orderItemList.length; i++) {
    //   if(product_code != "CASH"){
    //     if (this.order_items.orderItemList[i].itemId == product_code) {            
    //         this.order_items.orderItemList[i].quantity = parseInt(this.order_items.orderItemList[i].quantity) + parseInt(quantity);
    //         this.order_items.orderItemList[i].totalPrice = parseInt(this.order_items.orderItemList[i].quantity) * parseFloat(this.order_items.orderItemList[i].unitPrice);
    //         this.order_items.orderItemList[i].totalPrice = parseFloat(this.order_items.orderItemList[i].totalPrice).toFixed(2);
    //         this.order_items.orderItemList[i].sellingPrice = parseFloat(this.order_items.orderItemList[i].totalPrice).toFixed(2);
    //         found = true;
    //         break;
    //     }
    //   }else{
    //     if (this.order_items.orderItemList[i].itemId == product_code && this.order_items.orderItemList[i].unitPrice == item_unit_cost) {            
    //       this.order_items.orderItemList[i].quantity = parseInt(this.order_items.orderItemList[i].quantity) + parseInt(quantity);
    //       this.order_items.orderItemList[i].totalPrice = parseInt(this.order_items.orderItemList[i].quantity) * parseFloat(this.order_items.orderItemList[i].unitPrice);
    //       this.order_items.orderItemList[i].totalPrice = parseFloat(this.order_items.orderItemList[i].totalPrice).toFixed(2);
    //       this.order_items.orderItemList[i].sellingPrice = parseFloat(this.order_items.orderItemList[i].totalPrice).toFixed(2);
    //       found = true;
    //       break;
    //     }
    //   }
    // }
    // if(!found){
    //   // this.order_items.orderItemList.push(orderItemList);
      this.order_items.orderItemList.splice(0, 0, orderItemList);
    // }
    this.item_code = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_sellingPrice = null;
    
    let ordersInfo = {
      "clientName": this.tableNo,
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
    this.order_items.orderItemList.splice(index,1);
    let ordersInfo = {
      "clientName": this.tableNo,
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
        this.dcrService.getProductbyId(this.item_code)
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
  searchOrderByTableNo(tableNo,element){
    if(tableNo){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getOrderByTableNo(tableNo)
          .toPromise()
          .then(
            data => { // Success
              this.order_items = data;
              this.total = this.order_items.finalTotal;
              this.receiptNo = this.order_items.cashSalesNo
              // if(this.Products.length>0){
              //   if(this.Products.length==1){
              //     let Product = this.Products[0];
              //     this.item_code = Product.code;
              //     this.item_id = Product.id;
              //     this.item_name = Product.name;
              //     this.imagefile = Product.image_url;                  
              //     this.item_unit_cost = Product.item.sellingPrice;
              //     // this.item_unit_cost = Product.unitCost;
              //     // document.getElementById("itemquantity").focus();
              //     this.calTotal(null);
              //     document.getElementById("addItembtn").click(); 
              //   }else{            
              //     this.ProductLoadSel = false;
              //     // this.Items = data;
              //     document.getElementById("productItems").getElementsByTagName('input')[0].click();
              //   }
              // }else{
              //   this.item_code = null;
              //   this.item_unit_cost = null;
              //   this.item_name = null;
              //   this.imagefile = null;
              //   this.common.createModalMessage("Failed","No Product Found").error();
              // }
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });
      

    }    
  }
  modalLoaded(){
    this.paid = false;
    this.paid_money = null;
    document.getElementById("paidAmount").focus();  
  }
  
  discountVoucher(value){  
  }

  kickOpen = false;
  InputChange(event){
    if((this.item_code == null || this.item_code == "") && this.paid_money <= 0 && this.total > 0){       
      if ((event.keyCode == 10 || event.keyCode == 13) && event.ctrlKey){
        this.isModalVisible = true; 
      }else{
        this.saveOrder(false);
      }
      return
    } 
    if(this.item_code != null){
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
        document.getElementById("itemPrice").focus(); 
      }      
    }
  }
  
  formatImage(img: any): any {
    console.log(img)
    if(img){
      return this.common.formatImage(img);
    }
  }
  searchProduct(){
    if(this.item_code){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.getProductbyCode(this.item_code, true)
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
                  // document.getElementById("itemquantity").focus();
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
    this.order_items= { "orderItemList": []};
    this.total = 0.0;
    this.paid_money = 0.0;
    this.changes_money = 0.0;
    this.paid = false;
    this.itemCount = 0;
    this.isModalVisible = false;
    
    this.client_email = null;
    this.kickOpen = false;
    this.isCreditCard = false;
    this.receiptNo=null;
  }

  paid = false;
  generateReceipt(cashSalesInfo,print, printPrevious:any =false) {
    this.dcrService.serverPrint(cashSalesInfo,'receipt', this.receiptPrefix,print,printPrevious);
    if(!printPrevious){
      this.previousSales = cashSalesInfo;
      this.getTotal(cashSalesInfo,true);
      this.handleCancel();
    }
  }
  swap() {
    this.router.navigate(['/CheckOut']);
  }
  tableNo :any;
  posorder: any;
  selectTable(event,tableId:any=null) {
    console.log("selectTable")
    this.order_items = { "orderItemList": []};
    this.receiptNo = '';
    try{

      if(event.path[0].classList.contains('res-table')){
        this.tableNo = event.path[0].innerHTML;
        if(event.path[0].style.backgroundColor=="orangered"){
          this.searchOrderByTableNo(this.tableNo,event.path[0]);
        }
      }
    }catch(e){

    }
    if(document.getElementById("itemcode")){
      document.getElementById("itemcode").focus();  
    }else{
      console.log(event);
      
      this.isOrderModalVisible = true;
      // this.objConfirm = obj;
    }
  }
  handleOrder(id,obj){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.handledOrder(id)
        .toPromise()
        .then(
          res => { // Success
            this.loadAllPosOrder();
            this.common.createBasicMessage("save successful!!!");
            return true;
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            return true;
          }
        );      
    });
    this.isModalVisible = false;

  }
  printReceiptNo;
  previousSales;
  printReceipt(){
    this.generateReceipt(this.previousSales,true,true);
  }

  handleOk(): void {
    if(this.paid_money >= 0 ){
      if(this.changes_money >= 0 ){
        window.scrollTo(0, 0)
        this.isModalVisible = false;
      }
    }
  }
  
  handleCancel(): void {
    window.scrollTo(0, 0)
    let elements = Array.from(document.querySelectorAll('.restable')).filter(el => el.innerHTML.trim() === this.tableNo);
    console.log(elements);
    // elements.forEach(el => el.style.backgroundColor = 'whitesmoke');
    // document.getElementsByClassName('restable').stream().
    this.isModalVisible = false;
    this.isOrderModalVisible = false;
    this.isVisible = false;
    this.item_code =null;
    this.isCreditCard = false;
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

  saveSales(print){
    this.paidMoney();
    if(isNaN(this.total) || this.total != undefined || this.total != null){
      if(isNaN(this.paid_money) || this.paid_money != undefined || this.paid_money != null){ 
        if(this.total != 0 && this.paid_money != 0){ 
              if(parseFloat(this.total) > parseFloat(this.paid_money)){;
                this.paid_money = null;
                this.changes_money = 0.00;
                this.common.createModalMessage("Invalid", "Paid Amount must greater than Total Amount").error()
                this.isVisible = false;
                return;
              }   
              let sales: any = {
                "clientName": this.tableNo,
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
              this.isVisible = true;
              this.generateReceipt(sales,print);
              let elements = Array.from(document.querySelectorAll<HTMLElement>('.res-table') ).filter(el => el.innerHTML.trim() === this.tableNo);
              elements[0].style.backgroundColor="whitesmoke";
              try{
                document.getElementById("kickOpenDrawer").click();
              }catch(e){

              }
        } else{
          this.isModalVisible = true;
        }
      } else{
        document.getElementById("paidAmount").focus();  
      }
    } else{
      document.getElementById("paidAmount").focus();  
    } 
  }

  saveOrder(print){
    if(isNaN(this.total) || this.total != undefined || this.total != null){
      
      let sales: any = {
        "clientName": this.tableNo,
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
      // this.generateReceipt(sales,print);
      
      let elements = Array.from(document.querySelectorAll<HTMLElement>('.res-table') ).filter(el => el.innerHTML.trim() === this.tableNo);
      elements[0].style.backgroundColor="orangered";
    } else{
      document.getElementById("paidAmount").focus();  
    } 
  }
    

}
