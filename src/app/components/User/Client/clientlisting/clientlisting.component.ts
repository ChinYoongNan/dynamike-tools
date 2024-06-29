import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { DataService } from "../../../../services/data.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
import { Console } from 'console';


@Component({
  selector: 'app-clientlisting',
  templateUrl: './clientlisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ClientListingComponent implements OnInit {
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
    private location: Location,
    private dataService: DataService
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  pageHeader = {
    Title: "Client 客户",
    AddButton : {
      routerLink: "/ClientAdding",
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
      header:"Billing Address",
      column:"billingAddress",
      edit: true,
      type: "text"
    },
    {
      header:"Shipping Address",
      column:"shippingAddress",
      edit: true,
      type: "textarea"
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
    this.init();
  }

  ngAfterContentInit() {  
  }
  id:any;
  deleteButton(){
    document.getElementById("deleteButton").click()
  }
  deleteClient(value:any=null){    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.deleteClient(this.id)
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
  updateButton(){
    document.getElementById("updateButton").click()
  }
  updateClient(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveClient(this.updateData)
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
  getSelectedIndex(data){
    this.id = data;
  }
  updateData:any;
  getUpdatedData(data){
    this.updateData = data;
  }

  client_name:any;

  isVisible: boolean = false;
  NoResultId = "No Data" 
  tableEmpty: boolean = true;  

  Clients :any;
  init() {
    this.fetchData(); 
  }
  paginationData:any;
  nextPageSetting(data){
    this.paginationData = data;
    this.nextPage(this.paginationData.pageable.pageNumber,this.paginationData.pageable.pageSize);
  }
  async nextPage(page,size){
    let data = await this.dataService.loadClientByPage(page,size);
    if(data){
        this.Clients = data;
        console.log('nextPage - data:');
        console.log(data);
        this.common.notifyChild(this.tableData,data);
    }
  }
  private async fetchData(){
    this.nextPage(0,10);
    // this.Clients =  await this.dataService.loadClients();
    // console.log(this.Clients)
    // if(this.Clients){
    //   this.common.notifyChild(this.tableData,this.Clients);       
    // }
  }  
  async searchClient(){
    this.Clients = await this.dataService.searchClient(this.client_name, this.client_name)
    if(this.Clients){
      this.common.notifyChild(this.tableData,this.Clients);
    }
  }

 
}
