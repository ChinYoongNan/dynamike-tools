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
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class CompanyComponent implements OnInit {
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
    Title: "Detail",
    AddButton : {
      routerLink: "/CompanyAdd",
      queryParams: {debug: true}
    }
  }  

  headerData=[
    {
      header:"ID",
      column:"id",
      edit:false,
      type:null
    },
    {
      header:"Company Name",
      column:"name",
      edit: true,
      type: "textarea"
    },
    {
      header:"Registration No",
      column:"registrationNo",
      edit:true,
      type:"number"
    },
    {
      header:"Telephone No",
      column:"telephoneNo",
      edit: true,
      type: "number"
    },
    {
      header:"Address",
      column:"address",
      edit: true,
      type: "textarea"
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
  Detail :any;

  init() {
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getDetail()
        .toPromise()
        .then(
          data => { // Success
            this.Detail = data; 
            this.common.notifyChild(this.tableData,this.Detail)      
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
  }

  updateDetail(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveDetail(this.updateData)
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

  addDetail() {
    this.router.navigate(['/CompanyAdd'])
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
  deleteDetail(value:any =null){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteDetail(this.id)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Delete successful!!!");   
            this.init();         
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });
  }




}
