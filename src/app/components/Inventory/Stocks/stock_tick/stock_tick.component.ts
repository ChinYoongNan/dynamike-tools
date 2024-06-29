import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { DataService } from "../../../../services/data.service";
import { CommonService } from "../../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Console } from 'console';


@Component({
  selector: 'app-stock_tick',
  templateUrl: './stock_tick.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class StockTickComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
    private common: CommonService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  categoryType:any = '5';
  stockCheckForm: FormGroup;
  dateForm: FormGroup;
  menuViewType = 'menu';
  outlet:any = '1';
  ngOnInit(): void {
    this.init();


    this.stockCheckForm = this.formBuilder.group({
      item_unit_cost: ['', [Validators.required]],
      item_quantity: ['', [Validators.required]],
      outlet: ['', [Validators.required]]
    })

    this.dateForm = this.formBuilder.group({
      purchase_date: ['', Validators.required]
    })
  }
  
  getOutlet(outlet: string) {
    this.outlet = outlet;
    this.stockCheckForm.controls.outlet.setValue(outlet);
  }

  ngAfterContentInit() {
   
  }


  

  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"
 

  productListData: any[];
  tableEmpty: boolean = true;  
  item_index:any;
  item_code:any;
  item_name:any;
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  addItems(product_code,quantity,unit_cost,total_amount){
    if (this.stockCheckForm.invalid) { 
      Object.values(this.stockCheckForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.common.createModalMessage("Fields Required", "All field are required").error()
        }
      });
      return;
    }
    // ,amount
    total_amount = parseInt(quantity) * parseFloat(unit_cost);
    let stockCheck: any = {
      "id":null,
      "date": this.purchase_date,
      "productId": product_code,
      "supplierId": this.supplier_id,
      "quantity": quantity,
      "unitCost": unit_cost,
      "outlet": this.outlet,
      "total": parseFloat(total_amount).toFixed(2)
    } 
    let DBstockCheck: any = {
      "id":null,
      "date": this.purchase_date,
      "productId": product_code,
      "supplierId": this.supplier_id,
      "quantity": quantity,
      "unitCost": unit_cost,
      "outlet": this.outlet,
      "total": parseFloat(total_amount).toFixed(2)
    } 
    var found = false;
    for(var i = 0; i < this.stockChecks.stockCheck.length; i++) {
        if (this.stockChecks.stockCheck[i].productId == stockCheck.productId) {            
            this.stockChecks.stockCheck[i].quantity = parseInt(this.stockChecks.stockCheck[i].quantity) + parseInt(stockCheck.quantity);
            this.stockChecks.stockCheck[i].total = parseInt(this.stockChecks.stockCheck[i].quantity) * parseFloat(this.stockChecks.stockCheck[i].unitCost);
            this.stockChecks.stockCheck[i].total = parseFloat(this.stockChecks.stockCheck[i].total).toFixed(2);
            DBstockCheck = JSON.parse(JSON.stringify(this.stockChecks.stockCheck[i]));
            found = true;
            break;
        }
    }
    if(!found){
      this.stockChecks.stockCheck.push(stockCheck);
      // console.log(stockCheck);
    }
    
    
    this.item_index =null;
    this.item_code =null;
    this.item_name =null;
    this.item_unit_cost = null;
    this.item_quantity = null;
    this.imagefile = null;
    document.getElementById("itemcode").focus();
    this.stockCheck(DBstockCheck);
  }

  amountChange(value){
    this.total_amount = parseFloat(this.total_amount).toFixed(2);
  }
  deleteItem(index){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteStockCheck(this.stockChecks.stockCheck[index])
        .toPromise()
        .then(
          res => { // Success
            // this.reset();
            // this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    }); 
    this.stockChecks.stockCheck.splice(index,1);
  }
  headerColumn = ["Product Code / 代号","Quantity / 数量","Unit Cost / 单价","Total Value / 货价","Delete / 删除"];
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

  
  stockCheck(stockcheck){     
    if (this.dateForm.invalid) { 
      Object.values(this.dateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.common.createModalMessage("Fields Required", "All field are required").error()
        }
      });
      return;
    }
    let promise = new Promise((resolve, reject) => {
      this.dcrService.stockCheck(stockcheck)
        .toPromise()
        .then(
          res => { // Success
            let result = res['body'];
            for(var i = 0; i < this.stockChecks.stockCheck.length; i++) {
              if (this.stockChecks.stockCheck[i].productId == result[0].productId) {            
                  this.stockChecks.stockCheck[i].id = result[0].id;
                  break;
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

  //upgrade Select data
  ProductLoadSel: boolean = true;
  SupplierLoadSel: boolean = true;
  InvoiceLoadSel: boolean = true;
  init() {
    let d = new Date();
    this.purchase_date = new Date().toISOString().split("T")[0];
    if(this.router.url == '/CafeStockTick'){
      this.categoryType = '5'
    }else{
      this.categoryType = '1'
    }
    this.dcrService.getProducts().subscribe(data => {
      this.ProductLoadSel = false;
      this.Items = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
    this.loadStockCheckList(this.purchase_date);
    
    this.fetchData(5);
  }


  loadStockCheckList(date){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getStockCheckListing(date)
        .toPromise()
        .then(
          data => { // Success
            this.stockChecks.stockCheck = data['body'];
            if(data['body'].size >0){

              this.stockChecks.stockCheck = data;
            }
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
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
    console.log('ItemChange');
    console.log(value);
    console.log(this.Items);
    this.item_code = this.Products[value].id;
    this.searchProductById();
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
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;
                  this.item_unit_cost = Product.unitCost;
                  this.supplier_id = Product.supplier.id;
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
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;
                  this.item_unit_cost = Product.unitCost;
                  this.supplier_id = Product.supplier.id;
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
                this.supplier_id = null;
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

  /**
   * cafe
   */
  
  searchValue:any;
  pType:any="SellingPrice";
  modeView:any = 'stock';
  // ngOnInit(): void {  
  //   this.normalConfig()
  // }
  ngOnChanges(){
    // this.pType = this.priceType;
    // this.modeView = this.mode
  }

  getSearchValue(data){
    // this.searchValue=data;
    // this.returnResult.emit(data);
  }
  
  ProductTypes: any;
  private async fetchData(productCategory:any =null){
    if(productCategory == null){
      productCategory =1;
    }
    this.ProductTypes = await this.dataService.loadProductType(productCategory);
  }
}
