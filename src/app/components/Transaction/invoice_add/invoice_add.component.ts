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
  selector: 'app-invoice_add',
  templateUrl: './invoice_add.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class InvoiceAddComponent implements OnInit {
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
  ngOnInit(): void {
    this.init();

  }

  ngAfterContentInit() {
  }



  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"
 

  tableEmpty: boolean = true;
  


  Provider : any;
  order_product = ["Product Code / 代号","Quantity / 数量","Selling Price / 卖价","Delete / 删除"];
  date : any = "2021-04-18";
  duedate : any = "2021-04-18";
  client_id :any;
  index: any;
  invoice_no : any;
  orderId : any;
  currency: any;
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

  freeShippingChange(value){
    if(this.freeShipping){
      this.shippingFees ="0.00";
    }


  }
  ProviderChange(value){
    this.provider_id = this.Provider[value].id;
    this.provider = this.Provider[value].description;
  }

  ClientLoadSel: boolean = true;
  ProviderLoadSel: boolean = true;
  ProductLoadSel: boolean = true;
  init() {
    let d = new Date();
    this.date = new Date().toISOString().split("T")[0];
    this.duedate = new Date().toISOString().split("T")[0];
    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getProductbySupplier(null)
        .toPromise()
        .then(
          data => { // Success
            // this.ProductLoadSel = false;
            this.Items = data;
            // services_list = data;
            console.log(data);
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
    this.currency = "MYR"
  }
  loaded=false;
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
      this.loaded=true;
      
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
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
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  item_sellingPrice:any;
  OrderItems:any[];  
  addItems(product_code,quantity,item_unit_cost,item_sellingPrice){
    // ,amount
    // this.item_name = product_code.replaceAll("\\n","\n");
    let order_item: any = {
      "invoiceId":this.orderId,
      "itemName": this.item_name,
      // "itemId": product_code.replaceAll("\\n","\n"),
      "itemId": this.item_code,
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
  }
  calTotal(value){
    this.item_sellingPrice = parseFloat(this.item_unit_cost) * parseInt(this.item_quantity);
    this.item_sellingPrice = parseFloat(this.item_sellingPrice).toFixed(2);
  }

  reset(){
    this.item_sellingPrice = null;
    this.OrderItems = null;
    this.order_items= { "order_item": []};
    this.client_index=null;
    this.client_name=null;
    this.client_contact=null;
    this.client_address=null;
    this.client_shippingAddress=null;
    this.item_index=null;
    this.item_code=null;
    this.item_name=null;
    this.item_quantity=null;
    this.item_unit_cost=null;
    this.item_amount=null;
    this.loaded = false;
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
  }

  ClientChange(id){
    var selected = this.Client.filter(i => i.id == parseInt(id));
    var value = this.Client.indexOf(selected[0]);
    // this.client_id=this.Client[value].id;
    this.client_name=this.Client[value].name;
    this.client_contact=this.Client[value].contactNo;
    this.client_address=this.Client[value].billingAddress;
    this.client_shippingAddress=this.Client[value].shippingAddress;
  }
  serviceSelection(value) {
    console.log(this.Items[value].name)
    this.item_code = this.Items[value].code;
    this.item_name = this.Items[value].name.replaceAll("\\n","\n");
    
    
  }

  saveClient(){
    let client: any = {
      "name": this.client_name,
      "contactNo": this.client_contact,
      "billingAddress": this.client_address,
      "shippingAddress": this.client_shippingAddress
    } 
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveClient(client)
        .toPromise()
        .then(
          res => { // Success
            // this.Client = res;
            this.common.createModalMessage("Successful","save successful!!!").success()
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }
  Products:any;
  searchProduct(){
    if(this.item_index){
      this.dcrService.getProductbyId(this.item_index).subscribe(data => {
        this.Products = data;
        if(this.Products.length>0){
          let Product = this.Products[0];
          this.item_code = Product.product.code;
          this.item_unit_cost = Product.product.unitCost;
          this.item_name = Product.product.name;
        }else{
          this.item_code = null;
          this.item_unit_cost = null;
          // this.item_name = null;
          this.common.createModalMessage("Failed","No Product Found").error();
        }
        
      }, error => {
        if (error.error.text != "No Results") {
          this.common.errStatus(error.status, error.error);
        }
      })

    }    
  }
  getReceiptNo(){
    this.dcrService.getReceiptNo().subscribe(data => {
      this.orderId =this.receiptPrefix+data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }
  currency_list : any[] = [{"id":"MYR","value":"MYR"},
  {"id":"USD","value":"USD"}]
  salesTypes = [
    {"id":"2","value":"IT Sales"},
    {"id":"6","value":"Offline Retail / Wholesale"},
    {"id":"10","value":"Insurance Sales"},
  ]
  saleType = "2";
  receiptPrefix = 'Inv';
  cashSalesInfo:any;
  generateInvoice() {
    this.cashSalesInfo = {
      "index": this.index,
      "clientName": this.client_name,
      "cashSalesNo": this.orderId, 
      "address": this.client_address.replace("/n","<BR>"),
      "contactNo": this.client_contact,
      "email": this.client_email,
      "date": this.date,
      "duedate": this.duedate,
      "currency": this.currency,
      "ringgit": null,
      "cents": null,
      "type":this.saleType,
      // "subTotal": subTotal,
      // "finalTotal": subTotal,
      "orderItemList": this.order_items.order_item
    }
    if(!this.loaded){
      this.cashSalesInfo.cashSalesNo ='';
    }
    // this.dcrService.exportPDF(this.cashSalesInfo,'invoices');
    this.dcrService.exportReceiptPDF(this.cashSalesInfo,'invoices',this.orderId)
  }
}
