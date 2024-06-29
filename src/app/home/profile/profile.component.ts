import { Component, OnInit } from '@angular/core';
import { DcrService } from "../../services/dcr.service";
import { CommonService } from "../../services/common.service";
import { Subject, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../styles/themes.component.scss']
})
export class ProfileComponent implements OnInit {

  tableData : Subject<any> = new Subject<any>();
  constructor(
    private common: CommonService,
    private dcrService: DcrService) { }
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
  punchCardVisible:any = false;
  ngOnInit() {
    this.searchProduct()
  }
  
  searchProduct(){
    let promise = new Promise((resolve, reject) => {
      this.dcrService.getProductbyCode("Cocopie", false)
        .toPromise()
        .then(
          data => { // Success
            this.common.notifyChild(this.tableData,data);
          },
          msg => { // Error
          }
        );
    });                   
  }

  showPunchCard(){
    this.punchCardVisible = !this.punchCardVisible
  }

}
