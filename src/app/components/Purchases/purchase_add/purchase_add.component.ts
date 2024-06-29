import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Console } from 'console';


@Component({
  selector: 'app-purchase_add',
  templateUrl: './purchase_add.component.html',
  styleUrls: ['../../../styles/themes.component.scss']
})
export class PurchaseAddComponent implements OnInit {
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
  sub: any;
  viewId: any;
  viewMode: any;
  isVisible:any
  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.viewId = +params['id']; // +params['id']; (+) converts string 'id' to a number
      this.viewMode = +params['mode'];   
    });
   
  }

  ngAfterContentInit() {
    
  }

}
