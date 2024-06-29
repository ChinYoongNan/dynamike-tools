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
  selector: 'app-invoicetypelisting',
  templateUrl: './invoicetypelisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class InvoiceTypeListingComponent implements OnInit {
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
    Title: "Invoice Type / 单类",
    AddButton : {
      routerLink: "/InvoiceTypeAdd",
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
      header:"Operator",
      column:"operator",
      edit: true,
      type: "text"
    },
    {
      header:"Invalid",
      column:"invalid",
      edit: true,
      type: "text"
    },
    {
      header:"Account Type",
      column:"accountType",
      edit: true,
      type: "text"
    },
    {
      header:"Profit & Loss",
      column:"pl",
      edit: true,
      type: "text"
    },
    {
      header:"Balance Sheet",
      column:"bs",
      edit: true,
      type: "text"
    },
    {
      header:"Need Supplier",
      column:"supplier",
      edit: true,
      type: "text"
    }
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
    //table
    this.init();
  }

  ngAfterContentInit() {
    
  }


  All ="All / 全部";
  isVisible: boolean = false;
  NoResultId = "No Data"
  tableEmpty: boolean = true;
  InvoiceTypes :any;
  init() {
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getInvoiceTypes()
        .toPromise()
        .then(
          data => { // Success
            this.InvoiceTypes = data; 
            this.common.notifyChild(this.tableData,this.InvoiceTypes)      
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
  }

  updateInvoiceType(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveInvoiceType(this.updateData)
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
  
  addinvoicetype() {
    this.router.navigate(['/InvoiceTypeAdd'])
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
  deleteInvoiceType(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteInvoiceType(this.id)
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
