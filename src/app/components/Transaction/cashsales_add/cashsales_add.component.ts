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


@Component({
  selector: 'app-cashsales_add',
  templateUrl: './cashsales_add.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class CashsalesAddComponent implements OnInit {
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
    private commonDynamike: CommonDynamikeService,
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
  

  

  formatTime(min) {
    return moment(min).format('yyyy-MM-DD')
  }

  //highLight
  tdSelected: any;
  tdMouseOver(i) {
    this.tdSelected = i;
  }

  tdMouseOut() {
    this.tdSelected = "131355";
  }

  Provider : any;
  order_product = ["Item","Product Code / 代号","Unit Price / 单价","Quantity / 数量","Selling Price / 卖价","Delete / 删除"];
  date : any = "2021-04-18";
  client_id :any;
  invoice_no : any;
  orderId : any;
  paymentCredit: any ="0.00";
  paymentType : any ="4";
  shippingFees : any ="0.00";
  paymentFees: any ="0.00";
  discount: any ="0.00";
  remarks : any;
  provider_index: any;
  provider_id: any;
  provider: any;
  paymentDue: any;
  freeShipping: any;
  saveOrder(){
    let order: any = {
      "client":[],
      "date": this.date,
      "orderId": this.orderId,
      "paymentCredit": parseFloat(this.paymentCredit).toFixed(2),
      "balance": "0.00",
      "paymentDue": parseFloat(this.paymentDue).toFixed(2),
      "paymentType": [],
      "paymentFees": parseFloat(this.paymentFees).toFixed(2),
      "shippingFees": parseFloat(this.shippingFees).toFixed(2),
      "discount": parseFloat(this.discount).toFixed(2),
      "freeShipping": this.freeShipping,
      "remarks": this.remarks,
      "provider": [],
    }  
    let provider: any = {
      "id":this.provider_id,
      "description": this.provider
    }  
    let paymentType: any = {
      "id":this.paymentType
    } 
    let client: any = {
      "id":this.client_id,
      "name": this.client_name,
      "contactNo": this.client_contact,
      "billingAddress": this.client_address,
      "shippingAddress": this.client_shippingAddress
    } 
    order.provider = provider;
    order.client = client;
    order.paymentType = paymentType;
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveTransaction(order,this.order_items.order_item)
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


  ClientLoadSel: boolean = true;
  ProviderLoadSel: boolean = true;
  ProductLoadSel: boolean = true;
  init() {
    let d = new Date();
    this.date = new Date().toISOString().split("T")[0];
    this.dcrService.getallClient().subscribe(data => {
      this.ClientLoadSel = false;
      this.Client = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
    
  }
  cashSales:any;
  loadCashSales(){
    this.dcrService.loadSalesRecord(this.orderId).subscribe(data => {
      this.cashSales = data;
      this.client_name = this.cashSales.clientName;
      this.orderId = this.cashSales.cashSalesNo;
      this.client_address = this.cashSales.address;
      this.client_contact = this.cashSales.contactNo
      this.client_email = this.cashSales.email
      this.date = this.cashSales.date
      this.order_items.order_item = this.cashSales.orderItemList
      this.OrderItems = this.cashSales.orderItemList 
      this.getTotal(this.cashSales,false);
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }
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
  item_id:any;
  item_name:any;
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  item_sellingPrice:any;
  OrderItems:any[];  
  addItems(product_code,quantity,item_unit_cost,item_sellingPrice){
    this.calTotal(null);
    let order_item: any = {
      "invoiceId":this.orderId,
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
      this.OrderItems.push(order_item);
    }
    this.order_items.order_item.push(order_item);
    
    this.item_code = null;
    this.item_id = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_sellingPrice = null;
    this.item_quantity = null;
    
    let orderInfo = {
      "clientName": this.client_name,
      "cashSalesNo": this.orderId,
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
      
    this.getTotal(orderInfo,false);
    document.getElementById("itemcode").focus();    
  }

  
  amountChange(value){
    this.paymentDue = (this.paymentCredit - this.paymentFees - this.shippingFees).toFixed(2);
    
    this.paymentCredit = parseFloat(this.paymentCredit).toFixed(2);
    this.paymentFees = parseFloat(this.paymentFees).toFixed(2);
    this.shippingFees = parseFloat(this.shippingFees).toFixed(2);
    console.log(this.paymentDue);
  }
  deleteItem(index){    
    this.OrderItems.splice(index,1);
    if(this.OrderItems.length==0){
      this.OrderItems=null;  
    }    
    this.order_items.order_item.splice(index,1);
    
    let orderInfo = {
      "clientName": this.client_name,
      "cashSalesNo": this.orderId,
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
      
    this.getTotal(orderInfo,false);
  }

  ClientChange(value){
    this.client_id=this.Client[value].id;
    this.client_name=this.Client[value].name;
    this.client_contact=this.Client[value].contactNo;
    this.client_address=this.Client[value].billingAddress;
    this.client_shippingAddress=this.Client[value].shippingAddress;
  }

  saveClient(){
    let clientinfo: any = {
      "name": this.client_name,
      "contactNo": this.client_contact,
      "billingAddress": this.client_address,
      "shippingAddress": this.client_shippingAddress
    } 
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveClient(clientinfo)
        .toPromise()
        .then(
          res => { // Success
            this.ClientLoadSel = false;
            this.common.createModalMessage("Successful","save successful!!!").success()
          },
          msg => { // Error
            this.ClientLoadSel = true;
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }

  imagefile: any;
  ItemChange(value) {    
    this.item_code = null;
    this.item_id = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_code = this.Products[value].id;
    this.item_id = this.Products[value].code;
    this.searchProductById();
  }

  searchClient(event){
    this.dcrService.getClientsbyName(event.target.value, event.target.value).subscribe(data => {
      // this.ClientLoadSel = false;
      this.Client = data;
      document.getElementById("clients").blur();
      document.getElementById("clients").focus();
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    });
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
                  this.item_id = Product.code;
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;                      
                  for(let p = 0 ; p < Product.items.length ; p++){
                    if(Product.items[p]['priceType'] === 'WholesaleingPrice'){
                      this.item_unit_cost = Product.items[p].sellingPrice;
                    }
                  }              
                  document.getElementById("itemquantity").focus();
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
  
  InputChange(value){
    this.item_index =null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.searchProduct();
  }
  
  formatImage(img: any): any {
    if(img){
      return this.common.formatImage(img);
    }
  }
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
                  this.item_code = Product.code;
                  this.item_id = Product.code;
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;                      
                  for(let p = 0 ; p < Product.items.length ; p++){
                    if(Product.items[p]['priceType'] === 'WholesaleingPrice'){
                      this.item_unit_cost = Product.items[p].sellingPrice;
                    }
                  } 
                  document.getElementById("itemquantity").focus();
                }else{            
                  this.ProductLoadSel = false;
                  this.Items = data;
                  document.getElementById("productItems").getElementsByTagName('input')[0].click();
                }
              }else{
                this.item_code = null;
                this.item_id = null;
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
    } else{
      document.getElementById("receipt").click();         
    }
  }

  calTotal(value){
    this.item_sellingPrice = parseFloat(this.item_unit_cost) * parseInt(this.item_quantity);
    this.item_sellingPrice = parseFloat(this.item_sellingPrice).toFixed(2);
  }

  btnEvent(){
    document.getElementById("addItembtn").click();    
  }

  saleType = "5";
  receiptIndex: any;
  getReceiptNo(){
    this.dcrService.getReceiptNo().subscribe(data => {
      this.orderId ='CS'+data;
      this.receiptIndex = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }
  
  total:any;
  getTotal(info,generated){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getTotal(info)
        .toPromise()
        .then(
          res => { // Success
            this.total = res['body'];
            if(generated){
              this.common.createModalMessage("Total","RM"+res['body']).success()              
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
    this.item_id=null;
    this.item_name=null;
    this.item_quantity=null;
    this.item_unit_cost=null;
    this.item_amount=null;
    this.imagefile = null;
    this.orderId = null;
    this.order_items= { "order_item": []};
    this.total = 0.0;
  }

  cashSalesInfo:any;
  generateCashSale() {
    this.cashSalesInfo = {
      "clientName": this.client_name,
      "cashSalesNo": this.orderId,
      "address": this.client_address,
      "contactNo": this.client_contact,
      "email": this.client_email,
      "date": this.date,
      "ringgit": null,
      "cents": null,
      "type":this.saleType,
      // "subTotal": subTotal,
      // "finalTotal": subTotal,
      "orderItemList": this.order_items.order_item
    }
      
    this.dcrService.exportReceiptPDF(this.cashSalesInfo,'cashsales',this.orderId)
    this.getTotal(this.cashSalesInfo,true);
            
    this.reset();
    this.receiptIndex++;
    this.orderId ='CS'+this.receiptIndex;
  }
}

