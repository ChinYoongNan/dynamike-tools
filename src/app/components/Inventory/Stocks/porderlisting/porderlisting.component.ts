import { Component, OnInit, ViewChild, TemplateRef, HostListener, ElementRef } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

//service
import { DcrService } from "../../../../services/dcr.service";
import { DataService } from "../../../../services/data.service";
import { CommonService } from "../../../../services/common.service";
import { CommonDynamikeService } from "../../../../services/common.dynamike.service";

import * as moment from "moment";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxLoadingComponent } from "ngx-loading"
import { Location } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
import { Console } from 'console';


@Component({
  selector: 'app-porderlisting',
  templateUrl: './porderlisting.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class POrderListingComponent extends CommonDynamikeService implements OnInit {
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
    super();
    location.onUrlChange(url => this.ngAfterContentInit());
  }
  pageHeader = {
    Title: "写货单 POrder Listing",
    AddButton : {
      routerLink: "/POrderListAdd",
      queryParams: {debug: true}
    }
  }
  headerData=[
    {
      header:"Date",
      column:"date",
      edit: true,
      type: "text"
    },
    {
      header:"Supplier",
      value:"supplier.name",
      edit: true,
      type: "text"
    }
  ];
  tableSettings = {
    Action: {     
      View:{        
        function: this.viewButton        
      }
    }
  }
  ngOnInit(): void {
    this.init();
  }

  ngAfterContentInit() {  
  }
  
  viewButton(){
    document.getElementById("viewButton").click()
  }

  Clients :any;
  init() {
    this.fetchData(); 
  }

  async nextPage(paginationData,that:any = this){
    let page = !paginationData.pageable.pageNumber?0:paginationData.pageable.pageNumber
    let size = !paginationData.pageable.pageSize?10:paginationData.pageable.pageSize

    let data = await that.dataService.getPOListing(page,size);
    if(data){
      that.Clients = data;
        console.log('nextPage - data:');
        console.log(data);
        that.common.notifyChild(that.tableData,data);
    }
  }
  private async fetchData(){
    this.nextPage(this.paginationData);
  }  

  
  goToDetails() {
    this.router.navigate(['/POrderList', this.id]);
  }

 
}
