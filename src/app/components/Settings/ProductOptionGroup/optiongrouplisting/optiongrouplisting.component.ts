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
  selector: 'app-optiongrouplisting',
  templateUrl: './optiongrouplisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class OptionGroupListingComponent implements OnInit {
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
    Title: "Option Group",
    AddButton : {
      routerLink: "/OptionGroupAdd"
    }
  }  
  headerData=[
    {
      header:"Id",
      column:"option_id",
      edit:false,
      type:null
    },
    {
      header:"name",
      column:"name",
      edit: true,
      type: "text"
    },
    {
      header:"Active",
      column:"active",
      edit: true,
      type: "text"
    },
  ];
  tableSettings = {
    Delete : {
      function: this.deleteButton
    },
    Action: {
      View:{        
        function: this.viewButton        
      },
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
      this.dcrService.getOptionGroups()
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

  updateOptionGroup(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveOptionGroup(this.updateData)
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
  
  // addButton() {
  //   this.router.navigate(['/OptionGroupAdd'])
  // }
  id:any;
  deleteButton(){
    document.getElementById("deleteButton").click()
  }
  updateButton(){
    document.getElementById("updateButton").click()
  }
  viewButton(){
    document.getElementById("viewButton").click()
  }
  viewOptionGroup(){
    this.router.navigate(['/OptionGroup',this.id])
  }
  getSelectedIndex(data){
    this.id = data;
  }
  updateData:any;
  getUpdatedData(data){
    this.updateData = data;
  }
  deleteOptionGroup(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteOptionGroup(this.id)
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
