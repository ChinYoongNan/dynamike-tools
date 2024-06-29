import { Component, OnInit, Input,Output, EventEmitter } from '@angular/core';

import { CommonService } from "../../../../services/common.service";

import { Router } from '@angular/router';
import { AppComponent } from '../../../../app.component';
import { Subject, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-tabnav',
  templateUrl: './tabnav.component.html',
  styleUrls: ['./tabnav.component.scss']
})
// export class TabnavComponent implements OnInit {
  export class TabnavComponent{

  navList: any[];
  Selected: number;
  constructor(
    private common: CommonService,
    private router: Router,
    private appcomponent: AppComponent
  ) { }
  @Input() notifier: Subject<void>;
  @Input() categoryType: Subject<void>;
  tableData : Subject<any> = new Subject<any>();
  productCategoryType:any = 1;

  ngOnInit(): void {
  //   // this.appcomponent.introSetoptions();
  //   this.Selected = this.common.getItem("tabNu") ? Number(this.common.getItem("tabNu")) : 0

    this.navList = [
      { "name": "Price List / 货价", "link": "/ProductList" },
      { "name": "Expired List 货品过期记录", "link": "/PurchaseList" },
      { "name": "Goods Price List 货品本钱记录", "link": "/ProductList" },
    ]
    this.init();
  }
  
  init() { 
    if(this.notifier){
      this.notifier.subscribe((data) => 
        this.subscription(data)
      );
    }
    if(this.categoryType){
      this.categoryType.subscribe((data) => 
        this.productCategoryType=data
      );  
    }
  }
  ngOnDestroy() {
    // unsubscribe to avoid memory leaks
    if(this.notifier){
      this.notifier.unsubscribe();
    }
    if(this.categoryType){
      this.categoryType.unsubscribe();
    }
  }
  subscription(e){
    this.common.notifyChild(this.tableData,e)
  }

  change(n) {
    this.common.setItem("tabNu", n);
  }

  @Output() returnTabPaginationData = new EventEmitter();
  getPagination(data){
    this.returnTabPaginationData.emit(data);
  }


}
