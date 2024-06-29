import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { DataService } from "../../../services/data.service";
import { CommonService } from "../../../services/common.service";
import { CommonDynamikeService } from '../../../services/common.dynamike.service';

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-policylisting',
  templateUrl: './policylisting.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class PolicyListingComponent extends CommonDynamikeService implements OnInit {
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
    private location: Location
  ) { 
    super();
  }
  
  pageHeader = {
    Title: "Policy",
    AddButton : {
      routerLink: "/InsuranceAdd",
      queryParams: {debug: true}
    }
  }
  
  headerData=[
    {
      header:"policy No",
      column:"policyNo",
      edit: true,
      type: "text"
    },
    {
      header:"Insured Object",
      column:"insuredObject",
      edit: false,
      type: "text"
    },
    {
      header:"Insured Date",
      column:"insuredDate",
      edit: false,
      type: "text"
    },
    {
      header:"Renewal Date",
      column:"renewalDate",
      edit: false,
      type: "text"
    },
    {
      header:"Premium",
      column:"premium",
      edit: false,
      type: "text"
    },
    {
      header:"Commission",
      column:"commission",
      edit: true,
      type: "text"
    },
    {
      header:"Discount",
      column:"discount",
      edit: true,
      type: "text"
    },
    {
      header:"Road Tax",
      column:"roadtax",
      edit: true,
      type: "text"
    },
    {
      header:"Service Charges",
      column:"serviceCharges",
      edit: true,
      type: "text"
    },
    {
      header:"Other Charges",
      column:"others",
      edit: true,
      type: "text"
    },
    {
      header:"Net Amount",
      column:"netAmount",
      edit: true,
      type: "text"
    },
    {
      header:"Final Amount",
      column:"finalAmount",
      edit: true,
      type: "text"
    }
  ]
  tableSettings = {    
    Delete : {
      function: this.deleteButton
    },
    Action: {
      Update:{        
        function: this.updateButton        
      },            
      CustomFunction:[
        {
          desc:"loadIntoLedger",
          function: this.confirmButton   
        }
      ],
      View:{        
        function: this.viewButton        
      }
    }
  }

  tableData : Subject<any> = new Subject<any>();
  id:any;
  getSelectedIndex(data){
    this.id = data;
  }
  updateData:any;
  getUpdatedData(data){
    this.updateData = data;
  }  
  deleteButton(){
    document.getElementById("deleteButton").click()
  }
  updateButton(){
    document.getElementById("updateButton").click()
  }
  viewButton(){
    document.getElementById("viewButton").click()
  }
  confirmButton(){
    document.getElementById("confirmButton").click();
  }
  
  ngOnInit(): void {
    this.init();
  }

  Policies :any;
  searchValue: any = null;
  init() {
    this.nextPage(this.paginationData);
    
  }  
  async searchPolicy(){
    console.log(this.searchValue);
    this.nextPage(this.paginationData);
  }

  
  async nextPage(paginationData,that:any = this){
    let page = paginationData.pageable.pageNumber
    let size = paginationData.pageable.pageSize
    console.log(that.searchValue);
    let data = await that.dataService.loadPolicy(page,size,that.searchValue);
    if(data){
      that.Policies = data;
      that.common.notifyChild(that.tableData,data);
    }
  }

  All ="All / 全部";

  
  confirmGenerate(){
    var confirmed = JSON.parse(JSON.stringify(this.updateData));
    var selected = this.common.getListFromBE(this.Policies).filter(i => i.id == parseInt(confirmed.id));
    var value = this.common.getListFromBE(this.Policies).indexOf(selected[0]);
    let promise = new Promise((resolve, reject) => {
      this.dcrService.generatePolicy(this.common.getListFromBE(this.Policies)[value])
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
  updatePolicy(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.savePolicy(this.updateData)
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

  renews(id:any) {
    this.router.navigate(['/InsurancePolicy', id]);
  }

  addpolicy() {
    this.router.navigate(['/InsurancePolicy'])
  }
  goToDetails() {
    this.router.navigate(['/InsuranceDetail', this.id]);
  }

  deletePolicy(){
     this.dcrService.deletePolicy(this.id).subscribe(data => {
       this.common.createBasicMessage("delete successful!!!");
      //  this.Policies.splice(value,1);
     }, error => {
       if (error.error.text != "No Results") {
         this.common.errStatus(error.status, error.error);
       }
     }).unsubscribe();
  }
}
