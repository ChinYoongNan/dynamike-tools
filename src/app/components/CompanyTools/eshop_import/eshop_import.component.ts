import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';


@Component({
  selector: 'app-eshop_import',
  templateUrl: './eshop_import.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class EshopImportComponent implements OnInit {
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

  Provider : any;
  order_product = ["Product Code / 代号","Quantity / 数量","Delete / 删除"];
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
    console.log(this.order_items);
    this.dcrService.saveTransaction(order,this.order_items.order_item).subscribe(data => {
      this.reset();
      this.common.createBasicMessage("save successful!!!");
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    }).unsubscribe();
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
    this.dcrService.getClient().subscribe(data => {
      this.ClientLoadSel = false;
      this.Client = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })

    this.dcrService.getProvider().subscribe(data => {
      this.ProviderLoadSel = false;
      console.log(data);
      this.Provider = data;
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
  client_shippingAddress:any;
  item_index:any;
  item_code:any;
  item_name:any;
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  addItems(product_code,quantity){
    // ,amount
    let order_item: any = {
      "invoiceId":this.orderId,
      "itemName": this.item_name,
      "itemId": product_code,
      "quantity": quantity,
      "unitPrice":0.00,
      "totalPrice":0.00
    } 
    console.log(order_item);
    this.order_items.order_item.push(order_item);
    
  }

  reset(){
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
    this.order_items.order_item.splice(index,1);
  }

  ClientChange(value){
    this.client_id=this.Client[value].id;
    this.client_name=this.Client[value].name;
    this.client_contact=this.Client[value].contactNo;
    this.client_address=this.Client[value].billingAddress;
    this.client_shippingAddress=this.Client[value].shippingAddress;
  }
  ItemChange(value) {
    console.log(this.Items);
    this.item_code = this.Items[value].product.code;
    this.item_name = this.Items[value].product.name;
    // this.item_quantity = this.Items[value].quantity;
    // this.item_unit_cost = this.Items[value].product.unitCost;
    
    // this.item_amount:any;
    
    
  }

  Products:any;
  
  imageFile : File;
  shopeeUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.imageFile = fileInput.target.files[0];
      
      let promise = new Promise((resolve, reject) => {
        this.dcrService.uploadShopee(this.imageFile)
          .toPromise()
          .then(
            res => { // Success
              this.imageFile = null;
              this.common.createBasicMessage("save successful!!!");
            },
            msg => { // Error
              this.imageFile = null;
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });

    }
  }
  
  patchShopeeOrderWithTrx(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.imageFile = fileInput.target.files[0];
      
      let promise = new Promise((resolve, reject) => {
        this.dcrService.patchShopeeOrderWithTrx(this.imageFile)
          .toPromise()
          .then(
            res => { // Success
              this.imageFile = null;
              this.common.createBasicMessage("save successful!!!");
            },
            msg => { // Error
              this.imageFile = null;
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });

    }
  }

  vmUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.imageFile = fileInput.target.files[0];
      
      let promise = new Promise((resolve, reject) => {
        this.dcrService.uploadVMTransaction(this.imageFile)
          .toPromise()
          .then(
            res => { // Success
              this.imageFile = null;
              this.common.createBasicMessage("save successful!!!");
            },
            msg => { // Error
              this.imageFile = null;
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });

    }
  }

  
  lazadaOrderUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.imageFile = fileInput.target.files[0];
      
      let promise = new Promise((resolve, reject) => {
        this.dcrService.uploadLazada(this.imageFile)
          .toPromise()
          .then(
            res => { // Success
              this.imageFile = null;
              this.common.createBasicMessage("save successful!!!");
            },
            msg => { // Error
              this.imageFile = null;
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });

    }
  }

  lazadaTransactionUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.imageFile = fileInput.target.files[0];
      
      let promise = new Promise((resolve, reject) => {
        this.dcrService.uploadLazadaTransaction(this.imageFile)
          .toPromise()
          .then(
            res => { // Success
              this.imageFile = null;
              this.common.createBasicMessage("save successful!!!");
            },
            msg => { // Error
              this.imageFile = null;
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });

    }
  }
}
