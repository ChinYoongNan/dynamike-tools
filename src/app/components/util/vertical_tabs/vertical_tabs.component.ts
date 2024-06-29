import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef, Input, Output, EventEmitter } from '@angular/core';

import { FormGroup, FormArray, FormControl, ValidatorFn, ValidationErrors } from "@angular/forms";
import {FormBuilder, Validators} from '@angular/forms';
import { CommonService } from "../../../services/common.service";
import { CommonDynamikeService } from "../../../services/common.dynamike.service";
import { DataService } from "../../../services/data.service";
import { DcrService } from "../../../services/dcr.service";
import { Subject, BehaviorSubject } from 'rxjs';

import { Router, ActivatedRoute } from '@angular/router';
/**
 * @title Basic use of the tab group
 */
@Component({
  selector: 'app-vertical-tabs',
  templateUrl: 'vertical_tabs.component.html',
  styleUrls: ['vertical_tabs.component.css'],
})
export class VerticalTabComponent {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private common: CommonService,
    private dcrService: DcrService,
    public dynamike: CommonDynamikeService,
    private dataService: DataService,
    private cdr: ChangeDetectorRef, 
    // private router: Router,
    // private appcomponent: AppComponent
  ) {
  }
  

  @Input() notifier: any;
  @Input() categoryType: any;
  @Input() priceType: any;
  Selected: number;
  tableData = []
  searchTableData = new Subject<any>(); 
  productCategoryType:any = 1;
  productCategory = 4; // food menu

  
  selectedIndex = 0;
  @Input() dateFormData: any ;
  @Input() tabFormData;
  @Input() modeView;
  @Input() menuViewType;
  @Input() searchFormData;
  @Output() updatedData = new EventEmitter();
  buttonsEvent(data){
    this.updatedData.emit(data);
  }  
  
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
      header:"Selling Price / 卖价",
      column:"item",
      nestedColumn:"sellingPrice",
      edit: true,
      type: "text"
    },    
    {
      header:"Option Groups",
      column:"optionGroup",
      array:'name',
      edit: false,
      type: "displayArray"
    }, 
    {
      header:"Invalid",
      column:"invalid",
      edit: false,
      valid: true,
      type: "text"
    },
    {
      header:"Sold Out",
      column:"soldOut",
      edit: false,
      valid: true,
      type: "text"
    }
  ];
  tableSettings = {
    Action: {     
      Valid:{ 
        function: this.validButton  
      }, 
      Update:{        
        function: this.updateButton        
      },                 
      CustomFunction:[
        {
          desc:"selected",
          function: this.selectedButton   
        }
      ],            
      View:{        
        function: this.viewButton        
      },   
    },  
  }
  ngOnInit(): void {
  }
  changeMode(){
    console.log(this.menuViewType);
    if(this.menuViewType == "menu"){

      if(this.modeView == "stock"){      
        this.headerData=[
          {      
            header:"",
            column:"image_url",
            edit:false,
            type:"image"
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
            edit: false,
            type: "number"
          },
          {
            header:"Quantity / 存货",
            column:"stock",
            edit: true,
            type: "text",
          }
        ];
  
      }else{
        this.headerData=[
          {      
            header:"",
            column:"image_url",
            edit:false,
            type:"image"
          },    
          {
            header:"Id : ",
            column:"id",
            edit:false,
            type:null
          },
          {
            header:"Code / 代号 : ",
            column:"code",
            edit: false,
            type: "text"
          },
          {
            header:"Name / 货名 : ",
            column:"name",
            edit: true,
            type: "number"
          },        
          {
            header:"Selling Price / 卖价 : ",
            column:"item",
            nestedColumn:"sellingPrice",
            edit: true,
            type: "text"
          },   
          {
            header:"Invalid :",
            column:"invalid",
            edit: false,
            valid: true,
            type: "text"
          },  
          {
            header:"Sold Out : ",
            column:"soldOut",
            edit: false,
            valid: true,
            type: "text"
          }
        ];
      }      
      
    this.tableSettings.Action.Update = {
      function : this.updateButton
    }
    this.tableSettings.Action.View = {
      function : this.viewButton
    }
    this.tableSettings.Action.CustomFunction = [
      {
        desc:"selected",
        function: this.selectedButton   
      }
    ];  
    }else{
      this.headerData=[
        {      
          header:"",
          column:"image_url",
          edit:false,
          type:"image"
        },
        {
          header:"",
          column:"code",
          edit: false,
          type: "text"
        },
        {
          header:"",
          column:"name",
          edit: false,
          type: "number"
        },        
        {
          header:"",
          column:"item",
          nestedColumn:"sellingPrice",
          edit: false,
          type: "text"
        },      
        {
          header:"Option Groups",
          column:"optionGroup",
          array:'name',
          edit: false,
          type: "displayArray"
        }, 
        {
          header:"Sold Out",
          column:"soldOut",
          edit: false,
          valid: true,
          type: "text"
        }
      ];
    }     
    
    this.tableSettings.Action.Update = null;    
    this.tableSettings.Action.CustomFunction = [
      {
        desc:"selected",
        function: this.selectedButton   
      }
    ];  
    this.tableSettings.Action.View = {
      function : this.viewButton 
    } 
    this.tableSettings.Action.Valid = {
      function : this.validButton
    }
    // this.tableSettings = {
    //   Action: {      
    //     Update:null,                 
    //     CustomFunction:[
    //       {
    //         desc:"selected",
    //         function: this.selectedButton   
    //       }
    //     ],            
    //     View:{        
    //       function: this.viewButton        
    //     },   
    //   },  
    // }
  }
  changeConfig(){
    if(this.modeView){

      if(this.modeView == "order"){          
        this.tableSettings.Action.Update = null;    
        this.tableSettings.Action.CustomFunction = null;  
        this.tableSettings.Action.View = {
          function : this.selectedButton 
        }
        // this.tableSettings = {
        //   Action: {      
        //     Update:null,            
        //     CustomFunction:null,
        //     View:{        
        //       function: this.selectedButton        
        //     },   
        //   },  
        // }
      }else if(this.modeView == "stock"){
        this.tableSettings.Action.View = null;    
        this.tableSettings.Action.CustomFunction = null;  
        this.tableSettings.Action.Update  = {
          function : this.stockTickButton 
        } 
        // this.tableSettings = {
        //   Action: {      
        //     Update:{        
        //       function: this.stockTickButton        
        //     },                 
        //     CustomFunction:null,
        //     View:null,
        //   },  
        // }
  
      }else{       
        this.tableSettings.Action.View  = {
          function : this.viewButton 
        } 
        this.tableSettings.Action.Update  = {
          function : this.updateButton 
        }    
        this.tableSettings.Action.CustomFunction = null;  
        // this.tableSettings = {
        //   Action: {      
        //     Update:{        
        //       function: this.updateButton        
        //     },                 
        //     CustomFunction:null,
        //     // View:{        
        //     //   function: this.selectedButton        
        //     // },  
                  
        //     View:{        
        //       function: this.viewButton        
        //     },   
        //   },  
        // }
      }
    }
  }
    
  ngOnDestroy() {
  }
  
  change(value) {
    console.log('change:' + value);
    if(this.menuViewType !='order'){
      value--;  
    }
    if(value >= 0){
      if(this.tableData[value]){
        this.menuType = value;
        this.dynamike.paginationData.pageable.pageNumber = 0;
        this.nextPage(this.dynamike.paginationData)
      } 
    }       
  }
  menuType:any;
  async nextPage(paginationData,that:any = this){
    let data;
    if(that.modeView && that.modeView == 'stock'){
      data = await that.dataService.getStockProductByType(that.tabFormData[that.menuType].id,paginationData.pageable.pageNumber,paginationData.pageable.pageSize, that.dateFormData);
    } else {
      if(that.menuViewType && that.menuViewType == 'order'){
        data = await that.dataService.getValidProductByType(that.tabFormData[that.menuType].id,paginationData.pageable.pageNumber,paginationData.pageable.pageSize, that.priceType);
      } else {
        data = await that.dataService.getProductByType(that.tabFormData[that.menuType].id,paginationData.pageable.pageNumber,paginationData.pageable.pageSize, that.priceType);
      }
    }
    if(data){
      that.common.notifyChild(that.tableData[that.menuType],data);
    }
  }
  stockChecks;
  loadStockCheckList(date){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getStockCheckListing(date)
        .toPromise()
        .then(
          data => { // Success
            this.stockChecks = data['body'];
            if(data['body'].size >0){
              this.stockChecks = data;
            }
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
  }
  
  
  ngOnChanges() {
    this.changeMode();
    this.changeConfig();
    if(this.tabFormData){
      for(var i = 0; i < this.tabFormData.length; i++){     
        this.tableData[i] = new Subject<any>(); 
        if(i == 0){
          this.menuType = i;
          this.nextPage(this.dynamike.paginationData)
        }  
      }
    }
  }

  searchValue:any;
  getSearchValue(data){
    this.searchValue = data;
    this.selectedIndex = 0
    this.Selected = 0;
    this.common.notifyChild(this.searchTableData,data);
    this.cdr.detectChanges();
  }
  
  @Output() returnResult = new EventEmitter();
  selectMenu(){
    console.log(this.dynamike.updateData)
    this.returnResult.emit(this.dynamike.updateData);
  }
  selectedButton(){
    document.getElementById("selectedButton").click()
  }
  stockTickButton(){
    document.getElementById("stockTickButton").click()
  }
  updateButton(){
    document.getElementById("updateButton").click()
  }
  viewButton(){
    document.getElementById("viewButton").click()
  }
  validButton(){   
    document.getElementById("validButton").click()
  }
  stockTick(){
    let stockcheck: any = {
      "id":null,
      "date": this.dateFormData,
      "productId": this.dynamike.updateData.code,
      "supplierId": this.dynamike.updateData.supplier.id,
      "quantity": this.dynamike.updateData.stock,
      "unitCost": 0,
      "total": 0
    } 
    console.log('stockTick');
    console.log(stockcheck);
    let promise = new Promise((resolve, reject) => {
      this.dcrService.stockCheck(stockcheck)
        .toPromise()
        .then(
          res => { // Success
            let result = res['body'];
            this.common.createBasicMessage("save successful!!!");
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });  
  }
  updateValid(){  
    console.log(this.dynamike.updateData);  
    console.log(this.dynamike.id)
    let data = this.dynamike.updateData;
    if(this.dynamike.updateData['content']){
      data = this.dynamike.updateData['content'];
    }
    if(this.dynamike.updateData.inventory == false){
      this.dynamike.updateData.inventory = true;
    }else{
      this.dynamike.updateData.inventory = false;
    }
    this.updateProduct();
  }
  updateProduct(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.quickUpload(this.productCategoryType,this.dynamike.updateData)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");
            // this.refresh()
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
  
  goToDetails(id:any = null) {
    if(id!=null){
      this.dynamike.id=id;
    }
    this.router.navigate(['/Product', this.dynamike.id,this.productCategory]);
  }
  // paginationData : Subject<any> = new Subject<any>();
  
  paginationData:any;
  nextPageSetting(data){
    this.paginationData = data;
    this.nextPage(this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
  }
}

/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */