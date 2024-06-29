import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { PageDetailComponent } from "../../../util/pageDetail/pageDetail.component";
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-provider_add',
  templateUrl: './provider_add.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ProviderAddComponent implements OnInit {
  
  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    public pageDetailComponent: PageDetailComponent,
    private router: Router,
  ) { 
  }

  @Output() returnResult = new EventEmitter();
  pageHeader = {
    Title: "Add Provider",
    SaveButton : {
      function : this.buttonEvent
    }
  }
  
  ngOnInit(): void {
    this.pageDetailComponent.pageDetailData = [
      {
        type: "input",
        label: "Description",
        control: true,
        value: undefined
      }
    ]
  }


  buttonEvent(){
    document.getElementById('saveButton').click();    
  }

  saveProvider(){    
    this.pageDetailComponent.validate()
  }

  save(data:any = null){ 
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveProvider(data)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Save successful!!!");            
            this.backproviderlisting();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }

  backproviderlisting() {
    this.router.navigate(['/Settings'])
  }
}
