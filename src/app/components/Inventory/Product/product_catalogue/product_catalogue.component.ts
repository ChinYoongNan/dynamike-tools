import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { DataService } from "../../../../services/data.service";
import { CommonService } from "../../../../services/common.service";
import { CommonDynamikeService } from "../../../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { PdfViewerModule } from 'ng2-pdf-viewer';


@Component({
  selector: 'app-product_catalogue',
  templateUrl: './product_catalogue.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ProductCatalogueComponent implements OnInit {
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
    private dataService: DataService,    
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
  pdfSrc: any;
  ngOnInit(): void {
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

  formatTime(min) {
    return moment(min).format('yyyy-MM-DD')
  }

  // @HostListener('window:scroll', ['$event'])
  // scrollTop: number = 0;
  // onScroll(s) {
  // }

  

  Provider : any;
  order_product = ["Product Code / 代号","Unit Price / 单价","Quantity / 数量","Selling Price / 卖价","Delete / 删除"];
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
  isModalVisible: boolean;
  init() {
    let d = new Date();
    this.date = new Date().toISOString().split("T")[0];
    document.getElementById("itemcode").focus();  
    window.scrollTo(0, 0)
    this.isModalVisible = true; 
    this.fetchData()
  }
  
  private async fetchData(){
    this.price_list = await this.dataService.loadPriceType();
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
  item_quantity:any = 1;
  item_unit_cost:any;
  item_dimension:any;
  item_netWeight:any;
  item_amount:any;
  item_sellingPrice:any;
  OrderItems:any[];  
  imagefile:any;
  receiptNo:any;
  addItems(product_code,quantity,item_unit_cost,item_sellingPrice,item_dimension,item_netWeight){    
    if(this.price_type == null){
      this.reset()
      this.isModalVisible = true;
      return;
    }
    this.calTotal(null);
    // ,amount
    let order_item: any = {
      "invoiceId":this.orderId,
      "itemName": this.item_name,
      "itemId": product_code,
      "quantity": quantity,
      "packagingsize": quantity,
      "netweight":item_netWeight,
      "dimension":item_dimension,
      "unitPrice":item_unit_cost,
      "sellingPrice":this.item_sellingPrice,
      "totalPrice":(quantity* item_unit_cost),
      "imgUrl":this.imagefile,
      "name": this.item_name,
    }
    if(!this.OrderItems){
      this.OrderItems = [];
      this.OrderItems.push(order_item);
    }
    console.log(order_item.imgUrl)
    this.order_items.order_item.push(order_item);
    
    this.item_code = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_sellingPrice = null;
    this.item_quantity = null;
    
    let ordersInfo = {
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
    // this.getTotal(ordersInfo,false);
    document.getElementById("itemcode").focus();    
  }
  
  amountChange(value){
    this.paymentDue = (this.paymentCredit - this.paymentFees - this.shippingFees).toFixed(2);
    
    this.paymentCredit = parseFloat(this.paymentCredit).toFixed(2);
    this.paymentFees = parseFloat(this.paymentFees).toFixed(2);
    this.shippingFees = parseFloat(this.shippingFees).toFixed(2);
  }
  deleteItem(index){    
    this.OrderItems.splice(index,1);
    if(this.OrderItems.length==0){
      this.OrderItems=null;  
    }    
    this.order_items.order_item.splice(index,1);
  }

  ItemChange(value) {    
    this.item_code = null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.imagefile = null;
    this.item_code = this.Products[value].id;
    this.searchProductById();
  }

  calTotal(value){
    this.item_sellingPrice = parseFloat(this.item_unit_cost) * parseInt(this.item_quantity);
    this.item_sellingPrice = this.item_sellingPrice.toFixed(2);
  }
  price_type;
  price_list : any
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
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;                  
                  for(var i=0;i<Product.items.length;i++){
                    if( Product.items[i].priceType=== this.price_type){
                      this.item_unit_cost = Product.items[i].sellingPrice;
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
    if(this.price_type == null){
      this.reset()
      this.isModalVisible = true;
      return;
    }
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
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;
                  
                  for(var i=0;i<Product.items.length;i++){
                    if( Product.items[i].priceType=== this.price_type){
                      this.item_unit_cost = Product.items[i].sellingPrice;
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

  addToItemlist(){
    // this.calTotal(null);
    document.getElementById("addItembtn").click();    
  }
  
  total:any;
  getTotal(info,generated){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getTotal(info)
        .toPromise()
        .then(
          res => { // Success
            this.total = res['body'];
            this.total = parseFloat(this.total).toFixed(2);
            if(generated){
              this.common.createModalMessage("Total","RM "+this.total).success()  
              this.total = 0.0;            
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
    this.item_quantity=1;
    this.item_unit_cost=null;
    this.item_amount=null;
    this.imagefile = null;
    this.orderId = null;
    this.receiptNo = null;
    this.order_items= { "order_item": []};
    this.total = 0.0;
  }

  cashSalesInfo:any;
  generateCatalogue() {
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
      "orderItemList": this.order_items.order_item,
      // "forceOverwrite": false
    }
      
    this.dcrService.exportReceiptPDF(this.cashSalesInfo,'catalogue',"Product Catalogue")
  }

  generatePriceTag() {
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
      "orderItemList": this.order_items.order_item,
      // "forceOverwrite": false
    }
      
    this.dcrService.exportReceiptPDF(this.cashSalesInfo,'pricetag',"Price Tag")
  }
handleCancel(): void {
  if(this.price_type != null){
    this.isModalVisible = false;
  }  
}
}

