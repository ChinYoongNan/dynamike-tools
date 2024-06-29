import { Component, OnInit } from '@angular/core';
import { DcrService } from "../../services/dcr.service";
import { DataService } from "../../services/data.service";
import { CommonService } from "../../services/common.service";
import { Subject, BehaviorSubject } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { AccountService } from '../../services/account.service';
import { ROUTES, mainTools } from "./../../app.routing";
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['../../styles/themes.component.scss','./landing.component.scss']
})
export class LandingComponent implements OnInit {

  mainTools = mainTools;
  tableData : Subject<any> = new Subject<any>();
  voucherData : Subject<any> = new Subject<any>();
  bannerData : Subject<any> = new Subject<any>();
  productTypeData : Subject<any> = new Subject<any>();
  constructor(
    private common: CommonService,
    private dcrService: DcrService,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private appcomponent: AppComponent,
    public accountService: AccountService) { }
  
    
  revokeGoogleDriveToken(){
    console.log('revokeGoogleDriveToken')
    // let obj = this.dataService.revokeGoogleDriveToken();
    // console.log(obj)
    this.dcrService.revokeGoogleDriveToken().toPromise().then(
      data => { // Success
        console.log(data);
        var url= data['url'];
        console.log(url.toString());
        console.log(encodeURI(url.toString()));
        var ref = window.open(url, '_self');
      },
      msg => { // Error
        console.log(msg)
        // this.common.createModalMessage(msg.error.error, msg.error.message).error()
      }
    );
  }

  click(n) {
    this.appcomponent.isCollapsed = true;
    this.router.navigateByUrl(n);
    window.scrollTo(0, 0)
  }
  data = [
    {
      title: 'Title 1'
    },
    {
      title: 'Title 2'
    },
    {
      title: 'Title 3'
    },
    {
      title: 'Title 4'
    },
    {
      title: 'Title 5'
    },
    {
      title: 'Title 6'
    }
  ];
  headerData=[
    {
      title:"code",
      desc:"name",
      image: 'image_url',
      price: 'sellingPrice'
    }
  ]

  visible = false;

  get title(): string {
    return `<i nz-icon nzType="user"></i>`+`Profile`;
  }

  showDefault(): void {
    this.open();
  }


  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  voucherHeaderData=[
    {
      header:null,
      column:"description",
      edit: false,
      type: "text"
    },
    {
      header:"voucher",
      column:"voucher",
      edit: false,
      type: "barcode"
    }
  ];
  
  bannerHeaderData=[
    {
      // title:"code",
      // desc:"name",
      image: 'image_url',
      // price: 'sellingPrice'
    }
  ]
  bannerdata = [
    {
      image_url : '1xyCjsDZlWfyrOB3T8hQmU78TvVVlbswW'
    },
    {
      image_url : '1YN2wWgyWj0t0-rCBvNXZgkVaiGF1jp2M'
    }
  ]
  effect = 'scrollx';
  ProductTypes:any;
  voucher: any;
  ngOnInit() {
    this.searchProduct()
    this.revokeGoogleDriveToken();
  }
  
  async searchProduct(){
    
    this.ProductTypes = await this.dataService.loadProductType(null);
    if(this.ProductTypes){
      this.common.notifyChild(this.productTypeData,this.ProductTypes);
    }
    this.voucher = await this.dataService.loadVoucher();
    if(this.voucher){
      this.common.notifyChild(this.voucherData,this.voucher);
    }
    // let promise = new Promise((resolve, reject) => {
    //   this.dcrService.getProductbyCode("Cocopie", false)
    //     .toPromise()
    //     .then(
    //       data => { // Success
    //         console.log(data);
    //         this.common.notifyChild(this.tableData,data);
    //       },
    //       msg => { // Error
    //       }
    //     );
    // });                   
  }

  
  formatImage(img: any): any {
    if(img){
      return this.common.formatImage(img);
    }
  }

}
