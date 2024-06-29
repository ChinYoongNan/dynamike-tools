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
  selector: 'app-eshop_add',
  templateUrl: './eshop_add.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class EshopAddComponent implements OnInit {
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

  private sub: any;


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  pageMode ='Detail';
  ngOnInit(): void {    
    if(this.router.url.indexOf('EshopAdd')>0){
      this.pageMode ='Add';
    }
    this.sub = this.route.params.subscribe(params => {
      this.searchOrderId = +params['id']; // +params['id']; (+) converts string 'id' to a number
      this.searchOrder();
    }); 
    this.init();
  }

  ngAfterContentInit() {
  
  }


  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"
 

  tableEmpty: boolean = true;
  

  @HostListener('window:scroll', ['$event'])
  scrollTop: number = 0;
  onScroll(s) {
  }


  Provider : any;
  order_product = ["Product Code / 代号","Quantity / 数量","Selling Price / 卖价","Delete / 删除"];
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
    if(this.pageMode == 'Add'){

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
    }else{
      let promise = new Promise((resolve, reject) => {
        this.dcrService.updateTransaction(order,this.order_items.order_item,this.order_items.old_order_item)
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

    this.dcrService.getProvider().subscribe(data => {
      this.ProviderLoadSel = false;
      console.log(data);
      this.Provider = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })

    this.dcrService.getProducts().subscribe(data => {
      this.ProductLoadSel = false;
      this.Items = data;
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
    // this.client_id=this.Client[value].id;
    this.client_name=this.Client[value].name;
    this.client_contact=this.Client[value].contactNo;
    this.client_address=this.Client[value].billingAddress;
    this.client_shippingAddress=this.Client[value].shippingAddress;
  }
  ItemChange(value) {
    console.log(this.Items);
    this.item_code = this.Items[value].code;
    this.item_name = this.Items[value].name;
    // this.item_quantity = this.Items[value].quantity;
    this.item_unit_cost = this.Items[value].unit_cost;
    
    // this.item_amount:any;
    
    
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
            this.Client = res;
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }
  Products:any;

  cashSalesInfo:any;
  // generateCashSale(cashSalesNo,subTotal) {
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
      // "subTotal": subTotal,
      // "finalTotal": subTotal,
      "orderItemList": this.order_items.order_item
    }
    
    this.dcrService.exportPDF(this.cashSalesInfo,'cashsales');
    // this.dcrService.exportPDF(this.cashSalesInfo,'receipt');
  }


  searchOrderId:any;
  Payments: any;
  searchOrder(){
    if(this.searchOrderId){
      this.dcrService.getPaymentByOrderId(this.searchOrderId).subscribe(data => {
        this.Payments = data;
        if(this.Payments){
          let d = new Date(this.Payments.date);
          this.date = new Date().toISOString().split("T")[0];

          var selected_provider = this.Provider.filter(i => i.id == this.Payments.provider.id);
          this.provider_index = this.Provider.indexOf(selected_provider[0]);
          // this.provider_index=this.Payments.provider.id;
          this.provider_id=this.Payments.provider.id;
          this.provider=this.Payments.provider.description;

          this.client_id=this.Payments.client.id;
          this.client_name=this.Payments.client.name;
          this.client_contact=this.Payments.client.contactNo;
          this.client_address=this.Payments.client.billingAddress;
          this.client_shippingAddress=this.Payments.client.shippingAddress;
          this.paymentType=this.Payments.paymentType.id;
          this.orderId=this.Payments.orderId;
          this.paymentCredit=this.Payments.paymentCredit;
          this.paymentDue=this.Payments.paymentDue;
          this.paymentFees=this.Payments.paymentFees;
          this.shippingFees=this.Payments.shippingFees;
          this.discount=this.Payments.discount;
          this.freeShipping=this.Payments.freeShipping;
          this.remarks=this.Payments.remarks;
          this.freeShippingChange(1);
          this.order_items.order_item = this.Payments.orderList;
          this.order_items.old_order_item=JSON.parse(JSON.stringify(this.Payments.orderList));
        }else{

          this.common.createModalMessage("Failed","No Product Found").error();
        }
        
      }, error => {
        if (error.error.text != "No Results") {
          this.common.errStatus(error.status, error.error);
        }
      })

    }    
  }
}
