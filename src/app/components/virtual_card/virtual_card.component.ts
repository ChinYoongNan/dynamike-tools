import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../services/dcr.service";
import { DataService } from "../../services/data.service";
import { CommonService } from "../../services/common.service";
import { AccountService } from '../../services/account.service';

import { CommonDynamikeService } from "../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-virtual-card',
  templateUrl: './virtual_card.component.html',
  styleUrls: ['../../styles/themes.component.scss']
})
export class VirtualCardComponent implements OnInit {
  tableData : Subject<any> = new Subject<any>();
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;

  constructor(
    private common: CommonService,
    private accountService: AccountService,
    public dynamike: CommonDynamikeService
  ) { 
  }
  margin:any =0;
  background:any = 'orangered'
  lineColor:any = 'white'
  elementType = "svg";
  qrcode:any;
  staffProfile: any;
  clockTime: any;
  ngOnInit(){
    var userProfile = this.accountService.getUser();
    let code = 'admin';
    if(userProfile.staff){
      this.staffProfile = userProfile.staff;
      code = userProfile.staff.code?userProfile.staff.code:userProfile.staff.id;
    }
    this.clockTime = this.common.formatClockInAMPM(new Date())
    this.qrcode=code+'_'+ this.common.formatClockInTimeZone(new Date());
  }
  reset(){    
    this.ngOnInit();
  }
  
  

}
