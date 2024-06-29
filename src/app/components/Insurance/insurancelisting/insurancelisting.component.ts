import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
import { Console } from 'console';


@Component({
  selector: 'app-insurancelisting',
  templateUrl: './insurancelisting.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class InsuranceListingComponent implements OnInit {
  pageHeader = {
    Title: "Insurance 保险",
    AddButton : {
      routerLink: "/InsuranceClient",
      queryParams: {debug: true}
    }
  }
  
  nestedHeaderData=[
    {
      header:"policy No",
      column:"policyNo",
      edit: true,
      type: "text"
    },
    {
      header:"Insured Object",
      column:"insuredObject",
      edit: true,
      type: "text"
    },
    {
      header:"Renewal Date",
      column:"renewalDate",
      edit: true,
      type: "text"
    },
    {
      header:"Content Value",
      column:"contentValue",
      edit: true,
      type: "text"
    },
    {
      header:"Premium",
      column:"premium",
      edit: true,
      type: "text"
    },
    {
      header:"Commission",
      column:"commission",
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
      header:"Road Tax",
      column:"roadTax",
      edit: true,
      type: "text"
    },
    {
      header:"Final Amount",
      column:"finalAmount",
      edit: true,
      type: "text"
    },
    {
      header:"Paid / 已付",
      column:"paid",
      edit: true,
      status: true,
      type: "text"
    }
  ]
  headerData=[
    {
      header:"Client Name",
      column:"client",
      nestedColumn:"name",
      edit: true,
      type: "text"
    },
    {
      header:"Client Contact No",
      column:"client",
      nestedColumn:"contactNo",
      edit: true,
      type: "text"
    },
    {
      header:"Insured Name",
      column:"name",
      edit: true,
      type: "text"
    },
    {
      header:"Plate No",
      column:"plateNo",
      edit: true,
      type: "text"
    },
    {
      header:"IC No",
      column:"ic",
      edit: true,
      type: "text"
    },
    {
      header:"keyword",
      column:"keyword",
      edit: true,
      type: "text"
    },
    {
      header:"pdf_password",
      column:"pdfPassword",
      edit: true,
      type: "text"
    },
    {
      header:"Address",
      column:"address",
      edit: true,
      type: "text"
    },
    {
      header:"Policy Count",
      column:"policyCount",
      edit: true,
      type: "text"
    }
  ];
  expandProperty="policyList";
  tableSettings = {    
    Delete : {
      function: this.deleteButton
    },
    Action: {
      Update:{        
        function: this.updateButton        
      },
      View:{        
        function: this.viewButton        
      }
    },
    nested :{
      tableHeaderData :this.nestedHeaderData,
      Delete : {
        function: this.deleteButton
      },
      Action: {
        Status:{        
          function: this.statusButton        
        },            
        CustomFunction:[
          {
            desc:"renew",
            function: this.renewPolicy   
          }
        ],
        Update:{        
          function: this.updateButton        
        }
      }
    }
  }

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
  ngOnInit(): void {
    this.init();
  }
  renewPolicy(id){
    alert(id);
  }
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
  statusButton(){
    document.getElementById("statusButton").click()
  }
  updateStatus(){    
    // var selected = this.Purchases.filter(i => i.id == parseInt(this.id));
    // var value = this.Purchases.indexOf(selected[0]);
    // if(this.Purchases[value].paid){
    //   this.unpaidPurchase(value);
    // }else{
    //   this.paidPurchase(value);
    // }    
  }
  
  goToDetails() {
    // this.router.navigate(['/Purchase', this.id]);
  }

  buttonEvent(){
    document.getElementById('saveButton').click();
  }

  addInsurance() {
    this.router.navigate(['/InsuranceClient'])
  }
  ngAfterContentInit() {
    
  }

  // get table data 
  isVisible: boolean = false;
  NoResultId = "No Data"
 

  tableEmpty: boolean = true;
  

  header=["","Client Name","Client Contact No","Insured Name","Plate No","IC No","keyword","pdf_password","address","Policy Count","Action"];

  InsuranceClients :any;
  init() {
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getInsuranceClient()
        .toPromise()
        .then(
          data => { // Success
            this.InsuranceClients = data;   
            this.common.notifyChild(this.tableData,this.InsuranceClients)  
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
          }
        );
    });    
  }

  All ="All / 全部";

  viewPolicy(value){
    
    if(document.getElementsByClassName("trDisplayLabel"+value)[0].getAttribute("style")=="display:none"){
      let promise = new Promise((resolve, reject) => {
        this.dcrService.saveInsuranceClient(this.InsuranceClients[value])
          .toPromise()
          .then(
            res => { // Success
              this.common.createBasicMessage("save successful!!!");
              for(var i = 0 ; i < document.getElementsByClassName("trEditLabel"+value).length ; i++){
                document.getElementsByClassName("trEditLabel"+value)[i].setAttribute("style","display:none");
                document.getElementsByClassName("trDisplayLabel"+value)[i].setAttribute("style","display:");
              }
            },
            msg => { // Error
              this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
      });
    }else{      
      for(var i = 0 ; i < document.getElementsByClassName("trEditLabel"+value).length ; i++){
        document.getElementsByClassName("trEditLabel"+value)[i].setAttribute("style","display:");
        document.getElementsByClassName("trDisplayLabel"+value)[i].setAttribute("style","display:none");
      }
    }
    
    
  }

  updateInsurance(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveInsuranceClient(this.updateData)
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

  deleteInsurance(value:any = null){    
    // if(value == null){
    //   console.log(this.InsuranceClients.findIndex(item => item.id === this.id));
    //   var selected = this.InsuranceClients.filter(i => i.id == parseInt(this.id));
    //   value = this.InsuranceClients.indexOf(selected[0]);
    // }
    this.dcrService.deleteInsuranceClient(this.id).subscribe(data => {
      this.common.createBasicMessage("delete successful!!!");
      this.InsuranceClients.splice(value,1);
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    }).unsubscribe();
 }
}

