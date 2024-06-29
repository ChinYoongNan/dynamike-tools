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
// declare var require: any; var Html5QrcodeScanner = require('html5-qrcode');
import { Html5QrcodeScanner } from 'html5-qrcode'


@Component({
  selector: 'app-attendance_record.component',
  templateUrl: './attendance_record.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class AttendanceRecordComponent implements OnInit {
  tableData : Subject<any> = new Subject<any>();
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
  
  pageHeader = {
    Title: "Attendance Record",
    AddButton:null
  }  
  headerData=[
    {
      header:"Date",
      column:"date",
      edit:false,
      type: "text"
    },
    {
      header:"Employee Code",
      value:"employee.code",
      edit: false,
      type: "text"
    },
    {
      header:"Employee Name",
      value:"employee.name",
      edit: false,
      type: "text"
    },
    {
      header:"Clock In",
      column:"clockin",
      edit: false,
      type: "date"
    },
    {
      header:"Clock Out",
      column:"clockout",
      edit: false,
      type: "date"
    },
    {
      header:"Hours",
      column:"hours",
      edit: false,
      type: "text"
    }
  ];
  ngOnInit(): void {
    console.log(localStorage.getItem("user"));
    this.init();
  }

  ngAfterContentInit() {
    
    document.getElementById('code').focus();
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
      if(this.mode == 'admin'){
        this.nextPage(this.dynamike.paginationData);  
        this.staffId = null; 
        this.pageHeader = {
          Title: "Attendance Record",
          AddButton : {
            routerLink: "/InvoiceTypeAdd",
            queryParams: {debug: true}
          }
        } ;
        this.  
        headerData=[
          {
            header:"Date",
            column:"date",
            edit:false,
            type: "text"
          },
          {
            header:"Employee Code",
            value:"employee.code",
            edit: false,
            type: "text"
          },
          {
            header:"Employee Name",
            value:"employee.name",
            edit: false,
            type: "text"
          },
          {
            header:"Clock In",
            column:"clockin",
            edit: false,
            type: "date"
          },
          {
            header:"Clock Out",
            column:"clockout",
            edit: false,
            type: "date"
          },
          {
            header:"Hours",
            column:"hours",
            edit: false,
            type: "text"
          }
        ];
      }else if(this.mode == 'cafe'){
        this.nextPage(this.dynamike.paginationData);   
        this.staffId = null;
        this.pageHeader = {
          Title: "Attendance Record",
          AddButton : {
            routerLink: "/InvoiceTypeAdd",
            queryParams: {debug: true}
          }
        } ;
        this.  
        headerData=[
          {
            header:"Date",
            column:"date",
            edit:false,
            type: "text"
          },
          {
            header:"Employee Code",
            value:"employee.code",
            edit: false,
            type: "text"
          },
          {
            header:"Employee Name",
            value:"employee.name",
            edit: false,
            type: "text"
          },
          {
            header:"Clock In",
            column:"clockin",
            edit: false,
            type: "date"
          },
          {
            header:"Clock Out",
            column:"clockout",
            edit: false,
            type: "date"
          },
          {
            header:"Hours",
            column:"hours",
            edit: false,
            type: "text"
          }
        ];
      }else{
        var obj = JSON.parse(localStorage.getItem("user"));
        this.staffId = obj.staff.code
        this.pageHeader = {
          Title: "Attendance Record",
          AddButton : null
        } ;
        this.  
        headerData=[
          {
            header:"Date",
            column:"date",
            edit:false,
            type: "text"
          },
          {
            header:"Clock In",
            column:"clockin",
            edit: false,
            type: "date"
          },
          {
            header:"Clock Out",
            column:"clockout",
            edit: false,
            type: "date"
          },
          {
            header:"Hours",
            column:"hours",
            edit: false,
            type: "text"
          }
        ];
        this.nextPage(this.dynamike.paginationData);   
      }
    });
  }
  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }
  async nextPage(paginationData,that:any = this){
    let page = !paginationData.pageable.pageNumber?0:paginationData.pageable.pageNumber
    let size = !paginationData.pageable.pageSize?10:paginationData.pageable.pageSize

    let data = await that.dataService.getAllAttendance(page,size,that.staffId);
    if(data){
      that.PaySlip = data['content'];
      that.common.notifyChild(that.tableData,data);
    }
  }
  clock_code
  InputChange(clock_code){
    let params = {
      qrcode:clock_code
    }
    this.clock_code='';
    let promise = new Promise((resolve, reject) => {
      this.dcrService.clockInOut(params)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Clock In successful!!!");     
            this.noticationSoundPlay();
            this.init()    
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });
  }
  
  noticationSoundPlay(){
    let notication = new Audio();
    notication.src = "../../../../assets/pristine-609.mp3";
    notication.load();
    notication.play();
  }
  
  startScan(){    
    this.scanning();
  }
  
  scanning(){
    var clock_code;
    var that = this;
    var html5QrcodeScanner:Html5QrcodeScanner;
    html5QrcodeScanner = new Html5QrcodeScanner(
      "reader", { fps: 10, qrbox: 250 },null); 
    let onScanSuccess = function(decodedText, decodedResult) {
      // Handle on success condition with the decoded text or result.
      console.log(`Scan result: ${decodedText}`, decodedResult);
      // that.clock_code = decodedText;
      that.InputChange(decodedText);
      html5QrcodeScanner.clear();
    }
    let onScanError = function(errorMessage) {
      // handle on error condition, with error message
    }
    html5QrcodeScanner.render(onScanSuccess, onScanError);

  }

}
