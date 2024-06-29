import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
import { CommonDynamikeService } from "../../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { Subject, BehaviorSubject } from 'rxjs';
import { PageHeaderSection } from '../../../models/PageHeaderSection';


@Component({
  selector: 'app-gl_main',
  templateUrl: './gl_main.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class GLMainComponent implements OnInit {
  tableData : Subject<any> = new Subject<any>();
  categoryTabNav : Subject<any> = new Subject<any>();
  @ViewChild('ngxLoading', { static: false }) ngxLoadingComponent: NgxLoadingComponent;
  @ViewChild('customLoadingTemplate', { static: false }) customLoadingTemplate: TemplateRef<any>;
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private commonDynamike: CommonDynamikeService,
    private message: NzMessageService,
    private elementRef: ElementRef,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { 
  }
  pageHeader = new PageHeaderSection();
  sub:any;
  navList:any;
  categoryType:any;
  ngOnInit(): void {  
    this.pageHeader.Title = "User Maintenance";
    this.navList = [
      { "name": "Supplier", "link": "/SupplierListing" },
      { "name": "客人 Client", "link": "/ClientListing" },
    ]
  }
}
