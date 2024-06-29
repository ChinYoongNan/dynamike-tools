import { Component, OnInit, Input, ViewChild, TemplateRef, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { CommonDynamikeService } from "../../../../services/common.dynamike.service";
import { DataService } from "../../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { AnyTxtRecord } from 'dns';
import { Console } from 'console';
import { Subject, BehaviorSubject } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NzTreeHigherOrderServiceToken } from 'ng-zorro-antd';
import { MatDialog,MatDialogRef } from '@angular/material/dialog';
import { ProductDialogComponent } from '../product_dialog/product_dialog.component'
@Component({
  selector: 'app-productlisting',
  templateUrl: './productlisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ProductListingComponent implements OnInit {
  tableData : Subject<any> = new Subject<any>();  
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    public dynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cdr: ChangeDetectorRef, 
    private dataService: DataService,
    private dialog: MatDialog,
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  pageHeader = {
    Title: "Product Listing",
    AddButton : {
      routerLink: "/ProductAdd/"
    }
  }
  expandProperty="items";
  nestedHeaderData=[
    {
      header:"Price Type",
      column:"priceType",
      exclusive: "SellingPrice",
      edit:false,
      type:null,
    },
    {
      header:"Selling Price",
      column:"sellingPrice",
      edit: true,
      type: "text"
    },
    {
      header:"Net Weight",
      column:"netweight",
      edit: true,
      type: "text"
    },
    {
      header:"Packaging Size",
      column:"packagingsize",
      edit: true,
      type: "text"
    }
  ] 
  
  headerData=[
    {      
      header:"",
      column:"image_url",
      edit:false,
      type:"image"
    },    
    {
      header:"Id",
      column:"id",
      edit:false,
      type:null
    },
    {
      header:"Code / 代号",
      column:"code",
      edit: false,
      type: "text"
    },
    {
      header:"Name / 货名",
      column:"name",
      edit: true,
      type: "number"
    },
    {
      header:"Unit Cost / 进货价",
      column:"unitCost",
      edit: true,
      type: "text",
      onChange: this.autoSetPrice
    },
    {
      header:"Quantity / 存货",
      column:"stock",
      edit: true,
      type: "text",
      onChange: this.autoCalculateTotalStock
    },    
    {
      header:"Total Amount / 货钱",
      column:"totalStock",
      edit: true,
      type: "text"
    },        
    {
      header:"Selling Price / 卖价",
      column:"item",
      nestedColumn:"sellingPrice",
      edit: true,
      type: "text",
      onDialog: this.goToPriceDetails
    },            
    {
      header:"Weight / 重量",
      column:"weight",
      edit: true,
      type: "text"
    },            
    {
      header:"Size / 体积",
      column:"dimension",
      edit: true,
      type: "text"
    },
    {
      header:"Enable",
      column:"invalid",
      edit: false,
      valid: true,
      type: "text"
    }
  ];
  tableSettings = {
    Valid:{ 
      function: this.validButton  
    },
    Action: {
      Update:{        
        function: this.updateButton        
      },      
      View:{        
        function: this.viewButton        
      },      
      customPopFunction:{
        function: this.changeProductCodeButton,
        name: 'Switch',        
        title: 'Switch Code'
      }
    },
    nested :{
      tableHeaderData :this.nestedHeaderData,
      Action: {
        Update:{        
          function: this.updateButton        
        }
      }
    }    
  }
  sub:any;
  productCategory:any;
  @Input() notifier: Subject<void>;
  @Input() category: any;
  
  changeProductCodeButton(){
    document.getElementById("changeProductCodeButton").click();
  }
  newCode;
  changeProductCode(){
    let promise = new Promise((resolve, reject) => {
      let selectedProduct;
      selectedProduct = JSON.parse(JSON.stringify(this.dynamike.updateData));
      this.dcrService.changeProductCode(selectedProduct.id,this.dynamike.id,selectedProduct.code)
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
  ngOnDestroy() {
    if(this.notifier){
      // unsubscribe to avoid memory leaks
      this.notifier.unsubscribe();
    }
  }
  subscription(e){
    this.product_type = null;
    if(e['content']){
      let product = e['content'][0]['products'];
      let products = [...product]
      this.common.notifyChild(this.tableData,products);
    }else{
      this.common.notifyChild(this.tableData,e);
    }
  }
  setTable(){    
    this.expandProperty="items";
    this.nestedHeaderData=[
      {
        header:"Price Type",
        column:"priceType",
        exclusive: "SellingPrice",
        edit:false,
        type:null,
      },
      {
        header:"Selling Price",
        column:"sellingPrice",
        edit: true,
        type: "text"
      },
      {
        header:"Net Weight",
        column:"netweight",
        edit: true,
        type: "text"
      },
      {
        header:"Packaging Size",
        column:"packagingsize",
        edit: true,
        type: "text"
      }
    ] 
    
    this.headerData=[
      {      
        header:"",
        column:"image_url",
        edit:false,
        type:"image"
      },    
      {
        header:"Id",
        column:"id",
        edit:false,
        type:null
      },
      {
        header:"Code / 代号",
        column:"code",
        edit: false,
        type: "text"
      },
      {
        header:"Name / 货名",
        column:"name",
        edit: true,
        type: "number"
      },
      {
        header:"Unit Cost / 进货价",
        column:"unitCost",
        edit: true,
        type: "text",
        onChange: this.autoSetPrice
      },
      {
        header:"Quantity / 存货",
        column:"stock",
        edit: true,
        type: "text",
        onChange: this.autoCalculateTotalStock
      },    
      {
        header:"Total Amount / 货钱",
        column:"totalStock",
        edit: true,
        type: "text"
      },        
      {
        header:"Selling Price / 卖价",
        column:"item",
        nestedColumn:"sellingPrice",
        edit: true,
        type: "text",
        onDialog: this.goToPriceDetails
      },            
      {
        header:"Weight / 重量",
        column:"weight",
        edit: true,
        type: "text"
      },            
      {
        header:"Size / 体积",
        column:"dimension",
        edit: true,
        type: "text"
      },
      {
        header:"Enable",
        column:"invalid",
        edit: false,
        valid: true,
        type: "text"
      }
    ];
    
    this.tableSettings = {
      Valid:{ 
        function: this.validButton  
      },
      Action: {
        Update:{        
          function: this.updateButton        
        },      
        View:{        
          function: this.viewButton        
        },      
        customPopFunction:{
          function: this.changeProductCodeButton,
          name: 'Switch',        
          title: 'Switch Code'
        }
      },
      nested :{
        tableHeaderData :this.nestedHeaderData,
        Action: {
          Update:{        
            function: this.updateButton        
          }
        }
      }
    };
  }
  setMenuTable(){    
    this.expandProperty=null;
    this.nestedHeaderData=null;
    
    this.headerData=[
      {      
        header:"",
        column:"image_url",
        edit:false,
        type:"image"
      },    
      {
        header:"Id",
        column:"id",
        edit:false,
        type:null
      },
      {
        header:"Code / 代号",
        column:"code",
        edit: false,
        type: "text"
      },
      {
        header:"Name / 货名",
        column:"name",
        edit: true,
        type: "number"
      },        
      {
        header:"Selling Price / 卖价",
        column:"item",
        nestedColumn:"sellingPrice",
        edit: true,
        type: "text",
        onDialog: this.goToPriceDetails
      },  
      {
        header:"Enable",
        column:"invalid",
        edit: false,
        valid: true,
        type: "text"
      }
    ]
        
    this.tableSettings = {
      Valid:{ 
        function: this.validButton  
      },
      Action: {
        Update:{        
          function: this.updateButton        
        },      
        View:{        
          function: this.viewButton        
        },      
        customPopFunction:{
          function: this.changeProductCodeButton,
          name: 'Switch',
          title: 'Switch Code'
        }
      },
      nested :null    
    }
  }
  setStockTable(){    
    this.expandProperty=null;
    this.nestedHeaderData=null;
    
    this.headerData=[
      {      
        header:"",
        column:"image_url",
        edit:false,
        type:"image"
      },    
      {
        header:"Id",
        column:"id",
        edit:false,
        type:null
      },
      {
        header:"Code / 代号",
        column:"code",
        edit: false,
        type: "text"
      },
      {
        header:"Name / 货名",
        column:"name",
        edit: true,
        type: "number"
      },
      {
        header:"Unit Cost / 进货价",
        column:"unitCost",
        edit: true,
        type: "text",
        onChange: this.autoSetPrice
      },
      {
        header:"Quantity / 存货",
        column:"stock",
        edit: true,
        type: "text",
        onChange: this.autoCalculateTotalStock
      },    
      {
        header:"Total Amount / 货钱",
        column:"totalStock",
        edit: true,
        type: "text"
      },
      {
        header:"Enable",
        column:"invalid",
        edit: false,
        valid: true,
        type: "text"
      }
    ]
        
    this.tableSettings = {
      Valid:{ 
        function: this.validButton  
      },
      Action: {
        Update:{        
          function: this.updateButton        
        },      
        View:{        
          function: this.viewButton        
        },      
        customPopFunction:{
          function: this.changeProductCodeButton,
          name: 'Switch',
          title: 'Switch Code'
        }
      },
      nested :null    
    }
  }
  ngOnInit(): void {    
    if(this.notifier){
      this.notifier.subscribe((data) => 
        this.subscription(data)
      );
    }
  }
  ngAfterContentInit() {
    // this.init();
    this.sub = this.route.params.subscribe(params => {
      if(!this.category){
        if(params['type']){
          this.productCategory = +params['type']; // +params['id']; (+) converts string 'id' to a number
        }
      }else{
        this.productCategory = this.category;
      }
      // if(this.productCategory){
      //   this.pageHeader.AddButton.routerLink= this.pageHeader.AddButton.routerLink.replace("/","/"+this.productCategory);
      // }      
        let obj = this.dataService.loadTypeCategory(this.productCategory);
        obj.then(
          data => { // Success
            this.pageHeader.Title = data['description'];         
            this.cdr.detectChanges();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
      switch(this.productCategory){
        case 2:{
          this.setStockTable();
          break;
        }
        case 5:{
          this.setStockTable();
          break;
        }
        case 4:{
          this.setMenuTable();
          break;
        }
        default:{
          this.setTable();
        }
      }
      this.fetchData(this.productCategory);
    }); 
  }  
  viewButton(){
    document.getElementById("viewButton").click()
  }
  updateButton(){
    document.getElementById("updateButton").click()
  }
  validButton(){    
    document.getElementById("validButton").click()
  }

  updateValid(){  
    console.log(this.dynamike.updateData);  
    console.log(this.dynamike.id)
    let data = this.dynamike.updateData;
    if(this.dynamike.updateData['content']){
      data = this.dynamike.updateData['content'];
    }
    if(this.dynamike.updateData.invalid == false){
      this.dynamike.updateData.invalid = true;
    }else{
      this.dynamike.updateData.invalid = false;
    }
    this.updateProduct();
    // let data = this.ProductData;
    // var selected = data.filter(i => i.id == parseInt(this.id));
    // var value = data.indexOf(selected[0]);
    // if(value){
    //   if(this.ProductData['content']){
    //     if(this.ProductData['content'].invalid == false){
    //       this.ProductData['content'][value].invalid = true;
    //     }else{
    //       this.ProductData['content'][value].invalid = false;       
    //     }
    //     this.updateData = this.ProductData['content'][value];
    //   }else{
    //     if(this.ProductData.invalid == false){
    //       this.ProductData.invalid = true;
    //     }else{
    //       this.ProductData.invalid = false;
    //     }
    //     this.updateData = this.ProductData[value];
    //   }      
    //   this.updateProduct();
    // }
  }

  refresh(): void {
    this.ProductTypeChange(this.product_type);
  }
  
  updateProduct(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.quickUpload(this.productCategory,this.dynamike.updateData)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");
            this.refresh()
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  
  // id:any;
  // getSelectedIndex(data){
  //   this.id = data;
  // }
  // updateData:any;
  // getUpdatedData(data){
  //   this.updateData = data;
  // }
  // paginationData:any;
  nextPageSetting(data){
    this.dynamike.paginationData = data;
    this.nextPage(this.product_type,this.dynamike.paginationData.pageable.pageNumber,this.dynamike.paginationData.pageable.pageSize);
  }

  ProductTypes: any;
  product_type:any;
  product_name:any;
  ProductData:any;
  isVisible: boolean = false;
  NoResultId = "No Data" 
  tableEmpty: boolean = true;
  init() {
    // this.fetchData();
  }
  private async fetchData(productCategory:any =null){
    if(productCategory == null){
      productCategory =1;
    }
    this.ProductTypes = await this.dataService.loadValidProductType(productCategory);
  }
  goToPriceDetails(data:any = null, dialog) {
    // if(data!=null){
    //   this.dynamike=data;
    // }
    console.log(data)
    dialog.open(ProductDialogComponent, {
      width: '100vw',
      height: '85vh',
      data: {
        id: data.id
        // id: this.dynamike.id,
        // category:this.productCategory
      }
    });
    // this.router.navigate(['/Product', this.dynamike.id,this.productCategory]);
  }
  goToDetails(id:any = null) {
    if(id!=null){
      this.dynamike.id=id;
    }
    this.router.navigate(['/Product', this.dynamike.id,this.productCategory]);
  }
  //get Search value from child
  getSearchValue(data){
    this.ProductData = data;
    this.common.notifyChild(this.tableData,this.ProductData);
  }
  ProductTypeChange(value) {
    this.nextPage(value,0,10);
  }
  async nextPage(value,page,size,that:any = this){
    let data = await that.dataService.getProductByType(value,page,size);
    if(data){
        that.ProductData = data;
        that.common.notifyChild(that.tableData,data);
    }
  }

  autoCalculateTotalStock(product){
    product.totalStock = (parseFloat(product.unitCost) * parseInt(product.stock)).toFixed(2)
  }
  autoSetPrice(product){
    product.item.unitCost = parseFloat(product.unitCost).toFixed(2);
    product.item.sellingPrice = (parseFloat(product.unitCost) * 1.5).toFixed(2)

    product.item.price_50 = (parseFloat(product.unitCost) * 1.5).toFixed(2)
    product.item.price_45 = (parseFloat(product.unitCost) * 1.45).toFixed(2)
    product.item.price_40 = (parseFloat(product.unitCost) * 1.4).toFixed(2)
    product.item.price_35 = (parseFloat(product.unitCost) * 1.35).toFixed(2)
    product.item.price_30 = (parseFloat(product.unitCost) * 1.3).toFixed(2)
    product.item.price_25 = (parseFloat(product.unitCost) * 1.25).toFixed(2)
    product.item.price_20 = (parseFloat(product.unitCost) * 1.2).toFixed(2)
    product.item.price_15 = (parseFloat(product.unitCost) * 1.15).toFixed(2)
    product.item.price_10 = (parseFloat(product.unitCost) * 1.1).toFixed(2)
    product.totalStock = (parseFloat(product.unitCost) * parseInt(product.stock)).toFixed(2)
  }

  deleteProduct(){    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteProduct(this.dynamike.id)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("delete successful!!!");   
            this.init();         
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }

}