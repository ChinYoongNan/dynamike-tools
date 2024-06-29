import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Subject, BehaviorSubject } from 'rxjs';
import { Console } from 'console';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-porder_list',
  templateUrl: './porder_list.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class POrderListComponent extends CommonDynamikeService implements OnInit {
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
    super();
  }
  pageMode:'Add';
  sub:any;
  searchPOrderId:any;
  public tableData : Subject<any> = new Subject<any>();  
  porderForm: FormGroup;
  dateForm: FormGroup;
  ngOnInit(): void {
    this.init();
    if(this.router.url.indexOf('POrderListAdd')>0){
      this.pageMode ='Add';
    }
    this.sub = this.route.params.subscribe(params => {
      this.searchPOrderId = +params['id']; // +params['id']; (+) converts string 'id' to a number
      this.searchPOrder();
    }); 
    this.porderForm = this.formBuilder.group({
      item_quantity: ['', [Validators.required]]
    })

    this.dateForm = this.formBuilder.group({
      purchase_date: ['', Validators.required],
      supplier_id: ['', Validators.required]
    })
  }

  
  async searchPOrder(){
    this.dcrService.searchPOrder(this.searchPOrderId).toPromise()
    .then(
      data => { // Success
        this.purchase_date = data['date'];
        this.supplier_id = data['supplier']['id']   
        this.supplier_name = data['supplier']['name']   
        this.nextPage(this.paginationData);
      },
      msg => { // Error
        this.common.createModalMessage(msg.error.error, msg.error.message).error()
      }
    );
  }
  NoResultId = "No Data"
 

  productListData: any[];
  item_index:any;
  item_code:any;
  item_id:any;
  item_name:any;
  item_quantity:any;
  item_unit_cost:any;
  item_amount:any;
  name:any = null;
  addItems(product_code,quantity,unit_cost,total_amount){
    if (this.porderForm.invalid) { 
      Object.values(this.porderForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }
    // ,amount
    total_amount = parseInt(quantity) * parseFloat(unit_cost);
    let porder: any = {
      "id":null,
      "date": this.purchase_date,
      "product":{
        "id":this.item_id,
        "name":this.item_name,
        "code":product_code,
      },
      "supplier":{
        "id":this.supplier_id,
      },
      "name":this.name,
      // "supplier_id": this.supplier_id,
      "quantity": quantity,
      "unitCost": unit_cost,
      "total": parseFloat(total_amount).toFixed(2)
    } 
    let DBporder: any = {
      "id":null,
      "date": this.purchase_date,
      "product":{
        "id":this.item_id,
        "name":this.item_name,
        "code":product_code,
      },
      "supplier":{
        "id":this.supplier_id,
      },
      "name":this.name,
      // "supplier_id": this.supplier_id,
      "quantity": quantity,
      "unitCost": unit_cost,
      "total": parseFloat(total_amount).toFixed(2)
    } 
    var found = false;
    for(var i = 0; i < this.POrderList.porder.length; i++) {
        if (this.POrderList.porder[i].product.id == porder.product.id) {            
            this.POrderList.porder[i].quantity = parseInt(this.POrderList.porder[i].quantity) + parseInt(porder.quantity);
            this.POrderList.porder[i].total = parseInt(this.POrderList.porder[i].quantity) * parseFloat(this.POrderList.porder[i].unitCost);
            this.POrderList.porder[i].total = parseFloat(this.POrderList.porder[i].total).toFixed(2);
            DBporder = JSON.parse(JSON.stringify(this.POrderList.porder[i]));
            found = true;
            break;
        }
    }
    if(!found){
      this.POrderList.porder.push(porder);
    }
    
    
    this.item_index =null;
    this.item_code =null;
    this.item_name =null;
    this.item_unit_cost = null;
    this.item_quantity = null;
    this.imagefile = null;
    this.common.notifyChild(this.tableData,this.POrderList.porder);
    if(this.isS6){
      document.getElementById("itemcode").focus();
    }
    this.createPOrderList(DBporder);
  }
  
  
  SupplierChange(value){
    this.supplier_id = value;
    var selected = this.Suppliers.filter(i => i.id == parseInt(value));
    this.supplier_name = selected.name
    this.nextPage(this.paginationData);
  }
  amountChange(value){
    this.total_amount = parseFloat(this.total_amount).toFixed(2);
  }
  deleteItem(index){    
    var selected = this.POrderList.porder.filter(i => i.id == parseInt(this.id));
    var value = this.POrderList.porder.indexOf(selected[0]);
    console.log(this.POrderList.porder[value]);
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deletePOrderList(this.POrderList.porder[value])
        .toPromise()
        .then(
          res => { // Success
            // this.reset();
            this.common.createBasicMessage("delete successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });  
    this.total_po -= this.POrderList.porder[value].total;    
    this.total_po_string = this.total_po.toFixed(2);
    this.POrderList.porder.splice(value,1);   
    this.common.notifyChild(this.tableData,this.POrderList.porder);
  }
  headerData   = [
    {      
      header:"",
      value:"product.image_url",
      edit:false,
      type:"image"
    }, 
    {
      header:"Code / 代号",
      value:"product.code",
      edit:false,
      type:null
    },
    {
      header:"Name",
      column:"productName",
      edit:false,
      type:null
    },
    {
      header:"Custom Size",
      column:"name",
      edit:false,
      type:null
    },
    {
      header:"Quantity / 数量",
      column:"quantity",
      edit:false,
      type:null
    },
    {
      header:"Total Value / 货价",
      column:"total",
      edit:false,
      type:null
    },
  ]
  tableSettings = {        
    Delete : {
      function: this.deleteButton
    },
    Action : null
  }
  total_po=0;
  total_po_string;
  POrderList: any = { "porder": []};
  Suppliers : any;
  POOrder : any;
  Items : any;
  supplier_index :any;
  supplier_id:any;
  supplier_name:any;
  purchase_date = new Date().toISOString().split("T")[0];
  invoice_no : any = "";
  particular= "";
  type= "";
  total_amount:any;
  reset(){
    this.purchase_date = new Date().toISOString().split("T")[0];
    this.invoice_no  = "";
    this.particular= "";
    this.type= "";
    this.total_amount=null;
    this.supplier_index=null;
    this.supplier_id=null;
    this.supplier_name=null;
    this.POrderList = { "porder": []};
  }

  
  createPOrderList(porder){     
    // if (this.dateForm.invalid) { 
    //   Object.values(this.dateForm.controls).forEach(control => {
    //     if (control.invalid) {
    //       control.markAsDirty();
    //       control.updateValueAndValidity({ onlySelf: true });
    //     }
    //   });
    //   return;
    // }
    let promise = new Promise((resolve, reject) => {
      this.dcrService.createPOrderList(porder)
        .toPromise()
        .then(
          res => { // Success
            let result = res['body'];
            for(var i = 0; i < this.POrderList.porder.length; i++) {
              if (this.POrderList.porder[i].product.id == result[0].product.id) {            
                  this.POrderList.porder[i].id = result[0].id;
                  this.common.notifyChild(this.tableData,this.POrderList.porder);
                  break;
              }
            }
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
  }

  // id: any;
  ProductLoadSel: boolean = true;
  SupplierLoadSel: boolean = true;
  init() {
    let d = new Date();
    this.purchase_date = new Date().toISOString().split("T")[0];
    this.fetchData();
    // if(this.productCategory!=6&&this.productCategory!=1){
      this.loadItem(null)
    // }
    
  }
  async fetchData(){        
    this.Suppliers = await this.dataService.loadSuppliers();
  }

  async searchPO(){    
    if(this.purchase_date == null || this.supplier_id == null){
      return;
    }
    
    this.nextPage(this.paginationData);
  }
  async nextPage(paginationData,that:any = this){
    let page = !paginationData.pageable.pageNumber?0:paginationData.pageable.pageNumber
    let size = !paginationData.pageable.pageSize?10:paginationData.pageable.pageSize
  
    let data = await that.dataService.loadPOOrder(that.purchase_date,that.supplier_id,page,size);
    if(data){
      if(data['body']['content'].length>0){
        that.POrderList.porder = data['body']['content'];
        that.POrderList.porder.forEach(function (value) {
          that.total_po += value.total;
        });        
        that.total_po_string = that.total_po.toFixed(2);
        that.common.notifyChild(that.tableData,data['body']);

      }
    }
  }
  // getSelectedIndex(data){
  //   this.id = data;
  // }
  // updateData:any;
  // getUpdatedData(data){
  //   this.updateData = data;
  // }
  // paginationData:any;
  // nextPageSetting(data){
  //   this.paginationData = data;
  //   this.nextPage(this.purchase_date,this.supplier_id,this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
  // }
   
  deleteButton(){
    document.getElementById("deleteButton").click()
  }

  imagefile :any;
  formatImage(img: any): any {
    if(img){
      return this.common.formatImage(img);
    }
  }

  qtyChange(value){
    let item_quantity = this.item_quantity.replaceAll("[A-Za-z]","")
    this.total_amount = item_quantity * this.item_unit_cost;
    this.total_po+=this.total_amount;
    this.total_po_string = this.total_po.toFixed(2);
    this.addItems(this.item_code,this.item_quantity,this.item_unit_cost,this.total_amount)
  }
  InputChange(value){
    this.item_index =null;
    this.item_unit_cost = null;
    this.item_name = null;
    this.item_id = null;
    this.searchProduct();
  }
  isS6 = true;
  switchToCafePO(){
    this.isS6 = !this.isS6;
  }
  InventoryItemChange(value) {
    this.item_code = this.Items[value].id;
    this.searchProductById();
  }

  ItemChange(value) {
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
                  this.item_id = Product.id;
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;
                  this.item_unit_cost = Product.unitCost;
                  // this.supplier_id = Product.supplier.id;
                  document.getElementById("itemquantity").focus();
                }else{            
                  this.ProductLoadSel = false;
                  // this.Items = data;
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
      

    }    
  }
  loadItem(supplierId){
    let promise = new Promise((resolve, reject) => {
      // this.dcrService.getProductbySupplier(supplierId)
      this.dcrService.getAllOtherProduct()
      // this.dcrService.getProductbySupplier(this.supplier_id)
        .toPromise()
        .then(
          data => { // Success
            this.Items = data;
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
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
                  this.item_id = Product.id;
                  this.item_name = Product.name;
                  this.imagefile = Product.image_url;
                  this.item_unit_cost = Product.unitCost;
                  // this.supplier_id = Product.supplier.id;
                  document.getElementById("itemquantity").focus();
                }else{            
                  this.ProductLoadSel = false;
                  // this.Items = data;
                  document.getElementById("productItems").getElementsByTagName('input')[0].click();
                }
              }else{
                this.item_code = null;
                this.item_id = null;
                this.item_unit_cost = null;
                this.item_name = null;
                this.imagefile = null;
                // this.supplier_id = null;
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

  cashSalesInfo:any;
  generatePO() {
    this.cashSalesInfo = {
      "clientName": this.supplier_name,
      "cashSalesNo": this.supplier_id,
      "address": null,
      "contactNo": null,
      "email": null,
      "date": this.purchase_date,
      "ringgit": null,
      "cents": null,
      "type":null,
      "orderItemList": [],
      // "forceOverwrite":false
    }
    this.dcrService.exportReceiptPDF(this.cashSalesInfo,'porder',"PO_"+this.purchase_date+"-"+this.supplier_id)
            
    // this.reset();
  }
}
