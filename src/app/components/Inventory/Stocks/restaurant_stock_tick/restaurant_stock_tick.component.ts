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
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-restaurant_stock_tick',
  templateUrl: './restaurant_stock_tick.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class RestaurantStockTickComponent implements OnInit {
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
  dateForm: FormGroup;
  ngOnInit(): void {
    this.init();

    this.dateForm = this.formBuilder.group({
      purchase_date: ['', Validators.required]
    })
  }
  
  private async fetchProductTypeData(productCategory:any =null){
    this.ProductTypes = await this.dataService.loadValidProductType(productCategory);
    if(this.ProductTypes){
      for(let i = 0; i< this.ProductTypes.length ; i ++){
        this.fetchProduct(i,this.ProductTypes[i].id);
      }
    }
  }
  private async fetchProduct(index,type){
    let data = await this.dataService.getValidProductByType(this.ProductTypes[index].id,0,99);        
    if(data){
        this.ProductTypes[index].product = data['content'];        
        this.ProductTypes[index].product.forEach(element => {
          let result = this.stockChecks.stockCheck.filter(s => s.productId.includes(element.code));
          if(result.length >0){
            element.stock = result[0].quantity;
          }
        });        
    }
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
  
  addListItems(product_code,quantity,unit_cost,total_amount, product){
    console.log('addListItems')
    total_amount = parseInt(quantity) * parseFloat(unit_cost);
    let stockCheck: any = {
      "id":null,
      "date": this.purchase_date,
      "productId": product_code,
      "supplierId": this.supplier_id,
      "quantity": quantity,
      "unitCost": unit_cost,
      "total": parseFloat(total_amount).toFixed(2)
    } 
    let DBstockCheck: any = {
      "id":null,
      "date": this.purchase_date,
      "productId": product_code,
      "supplierId": this.supplier_id,
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
    this.stockCheck(DBstockCheck);
    this.saveProduct(product);
  }

  
  saveProduct(product){
    let data = this.dataService.saveproduct(product,'Detail',this.categoryType);
    data.toPromise()
    .then(
      res => { // Success
        this.common.createBasicMessage("save successful!!!");
        this.isVisible = false;
      },
      msg => { // Error
        this.isVisible = false;
        this.common.createModalMessage(msg.error.error, msg.error.message).error()
      }
    );
  }

  amountChange(value){
    this.total_amount = parseFloat(this.total_amount).toFixed(2);
  }
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
    
    this.fetchProductTypeData(this.categoryType);
  }


  loadStockCheckList(date){
    console.log('loadStockCheckList')
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


  Products:any;

  /**
   * cafe
   */
  
  ProductTypes: any;
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
  

  
  paginationData : Subject<any> = new Subject<any>();
  itemCode = new Subject<Object>();
  getSearchValue(data){
    console.log(data);
  }
}
