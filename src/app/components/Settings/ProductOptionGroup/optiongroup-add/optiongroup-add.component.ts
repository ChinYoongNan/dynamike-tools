import { Component, OnInit,Output, EventEmitter, ChangeDetectorRef  } from '@angular/core';
import { DcrService } from "../../../../services/dcr.service";
import { CommonService } from "../../../../services/common.service";
import { Router, ActivatedRoute } from '@angular/router';
import { PageDetailComponent } from "../../../util/pageDetail/pageDetail.component";
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-optiongroup-add',
  templateUrl: './optiongroup-add.component.html',
  styleUrls: ['../../../../styles/themes.component.scss']
})
export class OptionGroupAddComponent implements OnInit {

  constructor(
    private dcrService: DcrService,
    private dataService: DataService,
    private common: CommonService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef, 
    public pageDetailComponent: PageDetailComponent,
    private router: Router,
  ) { 
  }
  
  pageHeader = {
    Title: "Add Option Group",
    SaveButton : {
      function : this.buttonEvent
    }
  }
  optionGroup:any = {
    name:'',
    active: true,
    variation:[]
  };
  id:any; 
  Items:any;  

 
  private sub: any;
  ngOnInit(): void {
    
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.init();
  }
  async init(){
    this.Items = await this.dataService.getAllProductbyType(51);
    if(this.id){
      let data = await this.dataService.getOptionGroup(this.id);   
      if(data){
        this.optionGroup = data
        this.productOptionsChanges();
      }
    }

  }
  async productOptionsChanges(){

    if(this.optionGroup && this.Items){
      for(let o of this.Items){
        o.checked=false
      }
      if(this.optionGroup['variation']){
        for(let o of this.Items){
          if(this.optionGroup['variation'].filter(e=> e.id === o.id).length>0){
            o.checked =true
            this.cdr.detectChanges()
          }
        }
      }      
    }
}
  updateSingleChecked(value,id:any,options:any): void {
    if(value){
      this.optionGroup['variation'].push(options);
    }else{      
      var selected_provider = this.optionGroup['variation'].findIndex(i => i.id == id);
      this.optionGroup['variation'].splice(selected_provider,1);
    }
  }

  buttonEvent(){
    document.getElementById('saveButton').click();    
  }


  save(data:any = null){ 
    
    let promise = new Promise((resolve, reject) => {
      this.dcrService.saveOptionGroup(data)
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
