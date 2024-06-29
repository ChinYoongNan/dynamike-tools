import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
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
import { Subject, BehaviorSubject } from 'rxjs';
import { PageHeaderSection } from '../../../../models/PageHeaderSection';


@Component({
  selector: 'app-supplierlisting',
  templateUrl: './supplierlisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class SupplierListingComponent extends CommonDynamikeService implements OnInit {
  tableData : Subject<any> = new Subject<any>();
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    // public dynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private dataService: DataService
  ) { 
    super();
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  // pageHeader = {
  //   Title: "Supplier 供应商",
  //   AddButton : {
  //     routerLink: "/SupplierAdd",
  //     queryParams: {debug: true}
  //   }
  // }  
  headerData=[
    {
      header:"Id",
      column:"id",
      edit:false,
      type:null
    },
    {
      header:"Name",
      column:"name",
      edit: true,
      type: "text"
    },
    {
      header:"Contact No",
      column:"contactNo",
      edit: true,
      type: "number"
    },
    {
      header:"Company Id",
      column:"companyId",
      edit: true,
      type: "text"
    },
    {
      header:"Address",
      column:"address",
      edit: true,
      type: "textarea"
    },
    {
      header:"Email",
      column:"email",
      edit: true,
      type: "text"
    },
    {
      header:"Website",
      column:"website",
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
  pageHeader = new PageHeaderSection();
  ngOnInit(): void {
    this.init();
  }

  ngAfterContentInit() {
    
  }
  All ="All / 全部";
  isVisible: boolean = false;
  NoResultId = "No Data"
  tableEmpty: boolean = true;
  Suppliers :any;
  name: any;
  init() {
    this.pageHeader.Title = "Supplier 供应商";
    this.pageHeader.AddButton.routerLink = "/SupplierAdd";
    this.pageHeader.AddButton.queryParams = {debug: true};
    this.fetchData();
  }
  private async fetchData(){
    this.nextPage(this.paginationData);
  }
  async nextPage(paginationData,that:any = this){
    let page = paginationData.pageable.pageNumber
    let size = paginationData.pageable.pageSize
    console.log('nextPage');
    let promise = new Promise((resolve, reject) => {
      that.dcrService.getSupplier(page,size)
        .toPromise()
        .then(
          data => { // Success
            that.Suppliers = data; 
            that.common.notifyChild(that.tableData,data)      
          },
          msg => { // Error
            that.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });   
  }

  updateSupplier(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveSupplier(this.updateData)
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
  
  addsupplier() {
    this.router.navigate(['/SupplierAdd'])
  }
  id:any;
  deleteButton(){
    document.getElementById("deleteButton").click()
  }
  updateButton(){
    document.getElementById("updateButton").click()
  }
    
  async searchSupplier(){
    this.Suppliers = await this.dataService.searchSupplier(this.name)
    if(this.Suppliers){
      this.common.notifyChild(this.tableData,this.Suppliers);
    }
  }
  deleteSupplier(value:any =null){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteSupplier(this.id)
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
