import { Component, OnInit,Output, EventEmitter  } from '@angular/core';
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PageDetailComponent } from "../../../util/pageDetail/pageDetail.component";

@Component({
  selector: 'app-producttype-add',
  templateUrl: './producttype-add.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class ProductTypeAddComponent implements OnInit {

  constructor(
    private dcrService: DcrService,
    private common: CommonService,
    private route: ActivatedRoute,
    public pageDetailComponent: PageDetailComponent,
    private router: Router,
  ) { 
  }
  
  pageHeader = {
    Title: "Add Product Type",
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
      },
      {
        type: "input",
        label: "Type",
        control: true,
        value: undefined
      },
      {
        type: "input",
        label: "Prefix",
        control: false,
        value: undefined
      }
    ]
  }

  buttonEvent(){
    document.getElementById('saveButton').click();    
  }

  saveProductType(){    
    this.pageDetailComponent.validate()
  }

  save(data:any = null){ 
    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveProductType(data)
        .toPromise()
        .then(
          res => { // Success
            this.common.createBasicMessage("Save successful!!!");            
            this.backproducttypelisting();
          },
          msg => { // Error
            this.common.createModalMessage(msg.error.error, msg.error.message).error()
            }
          );
    });

  }


  backproducttypelisting() {
    this.router.navigate(['/Settings'])
  }
}
