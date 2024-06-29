import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-producttypelisting',
  templateUrl: './producttypelisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ProductTypeListingComponent implements OnInit {
  tableData : Subject<any> = new Subject<any>();
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
  pageHeader = {
    Title: "Product Type / 货品种类",
    AddButton : {
      routerLink: "/ProductTypeAdd",
      queryParams: {debug: true}
    }
  }  
  headerData=[
    {
      header:"Id",
      column:"id",
      edit:false,
      type:null
    },
    {
      header:"Description",
      column:"description",
      edit: true,
      type: "text"
    },
    {
      header:"Type",
      column:"type",
      edit: true,
      type: "number"
    },
    {
      header:"Prefix",
      column:"prefix",
      edit: true,
      type: "text"
    },
    {
      header:"Valid",
      column:"valid",
      edit: true,
      type: "text"
    },
  ];
  tableSettings = {
    Delete : {
      function: this.deleteButton
    },
    Action: {
      Update:{        
        function: this.updateButton        
      }
    }
  }
  ngOnInit(): void {
    this.init();
  }

  ngAfterContentInit() {
    
  }
  All ="All / 全部";
  isVisible: boolean = false;
  NoResultId = "No Data"
  tableEmpty: boolean = true;
  ProductTypes :any;
  init() {
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getProductTypes()
        .toPromise()
        .then(
          data => { // Success
            this.ProductTypes = data; 
            this.common.notifyChild(this.tableData,this.ProductTypes)      
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
  }

  updateProductType(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveProductType(this.updateData)
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
  
  addproducttype() {
    this.router.navigate(['/ProductTypeAdd'])
  }
  id:any;
  deleteButton(){
    document.getElementById("deleteButton").click()
  }
  updateButton(){
    document.getElementById("updateButton").click()
  }
  getSelectedIndex(data){
    this.id = data;
  }
  updateData:any;
  getUpdatedData(data){
    this.updateData = data;
  }
  deleteProductType(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteProductType(this.id)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("save successful!!!");   
            this.init();         
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }
}
