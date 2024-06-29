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
import { PageHeaderSection } from '../../../models/PageHeaderSection';


@Component({
  selector: 'app-voucher-list.component',
  templateUrl: './voucher.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class VoucherListingComponent extends CommonDynamikeService implements OnInit {
  tableData : Subject<any> = new Subject<any>();
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
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  
  pageHeader = new PageHeaderSection()
  headerData=[
    {
      header:"id",
      column:"id",
      edit:false,
      type: "text"
    },
    {
      header:"voucher",
      column:"voucher",
      edit: false,
      type: "text"
    },
    {
      header:"description",
      column:"description",
      edit: false,
      type: "text"
    },
    {
      header:"from",
      column:"from",
      edit: false,
      type: "date"
    },
    {
      header:"to",
      column:"to",
      edit: false,
      type: "date"
    },
    {
      header:"quantity",
      column:"quantity",
      edit: false,
      type: "text"
    }
  ];
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
    
    this.pageHeader.Title = "Vouchers"
    this.pageHeader.AddButton =null
    
    this.fetchData();
  }
  mode;
  async fetchData(){    
    this.nextPage(this.paginationData);   
  }
  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }
  async nextPage(paginationData,that:any = this){
    let page = !paginationData.pageable.pageNumber?0:paginationData.pageable.pageNumber
    let size = !paginationData.pageable.pageSize?10:paginationData.pageable.pageSize

    let data = await that.dataService.getAllVoucher(page,size);
    if(data){
      this.PaySlip = data['content'];
      console.log(this.PaySlip);
      that.common.notifyChild(that.tableData,data);
    }
  }

}
