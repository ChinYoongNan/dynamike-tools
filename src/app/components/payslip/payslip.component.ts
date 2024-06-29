import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../services/dcr.service";
import { DataService } from '../../services/data.service';
import { CommonService } from "../../services/common.service";
import { CommonDynamikeService } from "../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { PdfViewerModule } from 'ng2-pdf-viewer';


@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['../../styles/themes.component.scss']
})
export class PaySlipComponent implements OnInit {

  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
    private common: CommonService,
    private commonDynamike: CommonDynamikeService,
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

  ngAfterContentInit() {
    
    }

  isVisible: boolean = false;
  NoResultId = "No Data"
 

  formatTime(min) {
    return moment(min).format('yyyy-MM-DD')
  }
  hours: any ='0';
  StaffLoadSel: boolean = true;
  isModalVisible: boolean;
  init() {
    let d = new Date();
    this.date = new Date().toISOString().split("T")[0];
    this.startdate = new Date().toISOString().split("T")[0];
    this.enddate = new Date().toISOString().split("T")[0];
    this.loadStaff();
  }
  loadStaff(){
    this.dcrService.getallActiveStaffs().subscribe(data => {
      this.StaffLoadSel = false;
      this.staff_list = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }
  
  calculateCommissionPerMonth(staffId){
    this.dcrService.calculateCommissionPerMonth(this.code).subscribe(data => {
      console.log(data);
      this.commission = +data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }

  calculateHourlyWagesPerMonth(staffId){
    this.dcrService.calculateHourlyWagesPerMonth(this.code).subscribe(data => {
      
      this.hours = data;
    }, error => {
      if (error.error.text != "No Results") {
        this.common.errStatus(error.status, error.error);
      }
    })
  }
  saveStaff(){
    this.payslipInfo = {
      "id": this.id,
      "name": this.name,
      "code": this.code,
      "designation": this.designation,
      "accountno": this.acctno,
      "date": this.date,
      "startdate": this.startdate,
      "enddate": this.enddate,
      "ic": this.ic,
      "paymentmode": this.paymentmode,
      "bankcode": this.bankcode,
      "year": this.year_index,
      "month": this.month_index,
      "basic": this.basic,
      "commission": this.commission,
      "allowance": this.allowance,
      "others": this.others,
      "basic_sub": this.basic_sub,
      "epf": this.epf,
      "socso": this.socso,
      "eis": this.eis,
      "zakat": this.zakat,
      "tax": this.tax,
      "exp_sub": this.exp_sub,
      "epf_emp": this.epf_emp,
      "socso_emp": this.socso_emp,
      "eis_emp": this.eis_emp,
      "net_pay": this.net_pay,
      "ytd_epf": 0.00,
      "ytd_epf_emp": 0.00,
      "ytd_socso": 0.00,
      "ytd_socso_emp": 0.00,
      "ytd_eis": 0.00,
      "ytd_eis_emp": 0.00,
      "ytd_tax": 0.00
    }
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveStaff(this.payslipInfo)
        .toPromise()
        .then(
          res => { // Success
            this.StaffLoadSel = false;
            this.common.createModalMessage("Successful","save successful!!!").success()
            this.reset();
            this.loadStaff();
          },
          msg => { // Error
            this.StaffLoadSel = true;
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }
  YearLoadSel: boolean = true;
  month_index:any;
  year_index:any;
  month: any;
  

  id:any = null;
  staff:any;
  staff_list:any;
  name;
  code;
  designation;
  acctno;
  date;
  startdate;
  enddate;
  ic;
  paymentmode = "Bank";
  bankcode;
  year;
  basic= 0.00;
  commission= 0.00;
  allowance= 0.00;
  others= 0.00;
  basic_sub= 0.00;
  epf= 0.00;
  socso= 0.00;
  eis= 0.00;
  zakat= 0.00;
  tax= 0.00;
  exp_sub= 0.00;
  epf_emp= 0.00;
  socso_emp= 0.00;
  eis_emp= 0.00;
  net_pay = 0.00;

  reset(){
    this.id = null;
    this.name =null;
    this.code =null;
    this.designation =null;
    this.acctno =null;
    this.date =null;
    this.startdate =null;
    this.enddate =null;
    this.ic =null;
    // this.paymentmode =null;
    this.bankcode =null;
    this.year =null;
    this.month =null;
    this.basic = 0.00;
    this.commission = 0.00;
    this.allowance = 0.00;
    this.others = 0.00;
    this.basic_sub = 0.00;
    this.epf = 0.00;
    this.socso = 0.00;
    this.eis = 0.00;
    this.zakat = 0.00;
    this.tax = 0.00;
    this.exp_sub = 0.00;
    this.epf_emp = 0.00;
    this.socso_emp = 0.00;
    this.eis_emp = 0.00;
    this.net_pay = 0.00;
  }
  selectedStaff(index){
    this.id = this.staff_list[index].id;
    this.name =this.staff_list[index].name;
    this.code =this.staff_list[index].code;
    this.designation =this.staff_list[index].designation;
    this.acctno =this.staff_list[index].accountno;
    this.ic =this.staff_list[index].ic;
    this.bankcode =this.staff_list[index].bankcode;
    this.basic = this.staff_list[index].basic;
  }
  payslipInfo:any;
  generatePayslip() {
    this.month_index = this.common.formatDatePicker(this.month,'Month')
    this.year_index= this.common.formatDatePicker(this.year,'Year')    
    this.payslipInfo = {
      "name": this.name,
      "code": this.code,
      "designation": this.designation,
      "accountno": this.acctno,
      "date": this.date,
      "startdate": this.startdate,
      "enddate": this.enddate,
      "ic": this.ic,
      "paymentmode": this.paymentmode,
      "bankcode": this.bankcode,
      "year": this.year_index,
      "month": this.month_index,
      "basic": this.basic,
      "commission": this.commission,
      "allowance": this.allowance,
      "others": this.others,
      "basic_sub": this.basic_sub,
      "epf": this.epf,
      "socso": this.socso,
      "eis": this.eis,
      "zakat": this.zakat,
      "tax": this.tax,
      "exp_sub": this.exp_sub,
      "epf_emp": this.epf_emp,
      "socso_emp": this.socso_emp,
      "eis_emp": this.eis_emp,
      "net_pay": this.net_pay,
      "ytd_epf": 0.00,
      "ytd_epf_emp": 0.00,
      "ytd_socso": 0.00,
      "ytd_socso_emp": 0.00,
      "ytd_eis": 0.00,
      "ytd_eis_emp": 0.00,
      "ytd_tax": 0.00
    }
    let promise = new Promise((resolve, reject) => {
      this.dcrService.savePaySlip(this.payslipInfo)
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
    // this.dcrService.exportReceiptPDF(this.payslipInfo,'payslip',this.payslipInfo.code+"_"+this.payslipInfo.month+"_"+this.payslipInfo.year)
  }

}

