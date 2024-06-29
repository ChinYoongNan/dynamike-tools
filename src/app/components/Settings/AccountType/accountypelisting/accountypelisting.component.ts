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
  selector: 'app-accountypelisting',
  templateUrl: './accountypelisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class AccountTypeListingComponent implements OnInit {
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
    Title: "Account Type / 单类",
    AddButton : {
      routerLink: "/AccountTypeAdd",
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
      column:"name",
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
  AccountTypes :any;
  init() {
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getAccountTypes()
        .toPromise()
        .then(
          data => { // Success
            console.log(data);
            this.AccountTypes = data; 
            this.common.notifyChild(this.tableData,this.AccountTypes)      
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
  }

  updateAccountType(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveAccountType(this.updateData)
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
  
  addAccounttype() {
    this.router.navigate(['/AccountTypeAdd'])
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
  deleteAccountType(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteAccountType(this.id)
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
