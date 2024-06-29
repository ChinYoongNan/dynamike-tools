import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { DataService } from "../../../services/data.service";
import { CommonService } from "../../../services/common.service";
import { CommonDynamikeService } from "../../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-payslip_record.component',
  templateUrl: './payslip_record.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class PaySlipRecordComponent implements OnInit {
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
    private common: CommonService,
    public dynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { 
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  
  public tableData : Subject<any> = new Subject<any>();  
  pageHeader = {
    Title: "PaySlip Record",
    AddButton:null
  }  
  headerData=[
    {
      header:"Id",
      column:"id",
      edit:false,
      type:null
    },
    {
      header:"Employee Code",
      // column:"employeeCode",
      edit: false,
      value:"employee.code",
      type: "text"
    },
    {
      header:"Employee Name",
      // column:"employeeName",
      edit: true,
      value:"employee.name",
      type: "text"
    },
    {
      header:"Year",
      column:"year",
      edit: false,
      type: "text"
    },
    {
      header:"Month",
      column:"month",
      edit: false,
      type: "text"
    },
    {
      header:"Basic Pay",
      column:"basic",
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
      header:"Net Pay",
      column:"netpay",
      edit: false,
      type: "text"
    }
  ];
  tableSettings = {
    Action: {
      Buttons:[
        {        
          function: this.generateButton,
          icon: 'download'
        }, 
      ]
    }
  }
  ngOnInit(): void {
    this.init();
  }

  ngAfterContentInit() {
    
  }

  isVisible: boolean = false;
  NoResultId = "No Data"
  tableEmpty: boolean = true;
  PaySlip:any;
  private sub: any;
  init() {
    this.fetchData();
  }
  staffId;
  mode;
  async fetchData(){
    this.sub = this.route.params.subscribe(params => {
      this.mode = params['mode'];
      console.log(this.mode);
      if(this.mode == 'admin'){
        this.pageHeader = {
          Title: "PaySlip Record",
          AddButton : {
            routerLink: "/InvoiceTypeAdd",
            queryParams: {debug: true}
          }
        } 
        this.headerData=[
          {
            header:"Id",
            column:"id",
            edit:false,
            type:null
          },
          {
            header:"Employee Code",
            // column:"employeeCode",
            edit: false,
            value:"employee.code",
            type: "text"
          },
          {
            header:"Employee Name",
            // column:"employeeName",
            edit: true,
            value:"employee.name",
            type: "text"
          },
          {
            header:"Year",
            column:"year",
            edit: false,
            type: "text"
          },
          {
            header:"Month",
            column:"month",
            edit: false,
            type: "text"
          },
          {
            header:"Basic Pay",
            column:"basic",
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
            header:"Net Pay",
            column:"netpay",
            edit: false,
            type: "text"
          }
        ];
        this.nextPage(this.dynamike.paginationData);   
      }else{
        console.log();
        this.staffId = '10016'
        this.pageHeader = {
          Title: "PaySlip Record",
          AddButton:null
        } 
        this.headerData=[
          {
            header:"Year",
            column:"year",
            edit: false,
            type: "text"
          },
          {
            header:"Month",
            column:"month",
            edit: false,
            type: "text"
          }
        ];
        this.nextPage(this.dynamike.paginationData,this.staffId);   
      }
    });
  }
  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }
  async nextPage(paginationData,staffId:any='',that:any = this){
    let page = !paginationData.pageable.pageNumber?0:paginationData.pageable.pageNumber
    let size = !paginationData.pageable.pageSize?10:paginationData.pageable.pageSize

    let data = await that.dataService.getAllPaySlip(page,size,staffId);
    if(data){
      this.PaySlip = data['content'];
      that.common.notifyChild(that.tableData,data);
    }
  }

  payslipInfo:any;
  generatePdf(){    
    var selected = this.PaySlip.filter(i => i.id == parseInt(this.dynamike.id));
    var value = this.PaySlip.indexOf(selected[0]);
    this.payslipInfo = {
      "name": this.PaySlip[value].employee.name,
      "code": this.PaySlip[value].employee.code,
      "designation": this.PaySlip[value].employee.designation,
      "accountno": this.PaySlip[value].employee.accountno,
      "date": this.common.formatDatePicker(this.PaySlip[value].date,'Date'),
      "startdate": this.common.formatDatePicker(this.PaySlip[value].startDate,'Date'),
      "enddate": this.common.formatDatePicker(this.PaySlip[value].endDate,'Date'),
      "ic": this.PaySlip[value].employee.ic,
      "paymentmode": this.PaySlip[value].paymentMode,
      "bankcode": this.PaySlip[value].employee.bankcode,
      "year": this.PaySlip[value].year,
      "month": this.PaySlip[value].month,
      "basic": this.PaySlip[value].basic,
      "commission": this.PaySlip[value].commission,
      "allowance": 0.00,
      "others": 0.00,
      "basic_sub": 0.00,
      "epf": 0.00,
      "socso": 0.00,
      "eis": 0.00,
      "zakat": 0.00,
      "tax": 0.00,
      "exp_sub": 0.00,
      "epf_emp": 0.00,
      "socso_emp": 0.00,
      "eis_emp": 0.00,
      "net_pay": this.PaySlip[value].netpay,
      "ytd_epf": 0.00,
      "ytd_epf_emp": 0.00,
      "ytd_socso": 0.00,
      "ytd_socso_emp": 0.00,
      "ytd_eis": 0.00,
      "ytd_eis_emp": 0.00,
      "ytd_tax": 0.00
    }
    this.dcrService.exportReceiptPDF(this.payslipInfo,'payslip',this.payslipInfo.code+"_"+this.payslipInfo.month+"_"+this.payslipInfo.year)
  
  }
  
  generateButton(){
    document.getElementById("generateButton").click()
  }
}
