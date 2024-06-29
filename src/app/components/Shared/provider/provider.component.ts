import {Component, OnInit,Output,Input, EventEmitter} from '@angular/core';
import {isNullOrUndefined} from 'util';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import {filter} from 'rxjs/operators';

import { DcrService } from "../../../services/dcr.service";
import { CommonService } from "../../../services/common.service";
@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.scss']
})
export class ProviderComponent implements OnInit {
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    // private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
  }
  provider:any = {
    id: '',
  };
  @Input() outlet:any;
  @Output() getProviderEvent = new EventEmitter<string>();
  getProvider(value) {
    this.getProviderEvent.emit(value);
  }
  providerType : any = [];
  ngOnInit(){
    this.dcrService.getProvider().subscribe(data => {
      // this.ProviderLoadSel = false;
      console.log(data);
      console.log(this.outlet)
      let providerType = Object.assign(data);
      if(this.outlet!='1'){
        this.providerType = providerType.filter(e=> e.outlet == this.outlet);
        console.log(this.providerType)
      }else{
        this.providerType = providerType
      }
      // this.Provider = data;
    }, error => {
      if (error.error.text != "No Results") {
        // this.common.errStatus(error.status, error.error);
      }
    })

  }

}
