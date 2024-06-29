import {Component, OnInit, Input, Output, EventEmitter, Injectable} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router, RouterEvent} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-page-detail',
  templateUrl: './pageDetail.component.html',
  styleUrls: ['./pageDetail.component.scss']
})
@Injectable({ providedIn: 'root' })
export class PageDetailComponent implements OnInit {
  validForm: FormGroup;
  public pageDetailData;
  @Input() pageDetail: any ;
  @Input() checkValidForm: any ;
  @Output() outputData = new EventEmitter();
  @Output() save = new EventEmitter();
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {  
    let group = {};
    this.pageDetail.forEach(function (field) {
      if(field.control){
        group[field.label] = ['', [Validators.required]];
      }else{
        group[field.label] = [''];
      }
    });
    this.validForm = this.formBuilder.group(group);
  }

  changeValue(){
    this.outputData.emit(this.pageDetail);
  }


  public getOutputData(data){
    this.pageDetailData = data;
  }


  public validate(){
    document.getElementById('validButton').click();
  }

  validateForm(){
    if (this.validForm.invalid) { 
      Object.values(this.validForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }else{   
      let saveData={};
      this.pageDetail.forEach(function (field) {
        saveData[field.label.toLowerCase()] = field.value;
      });
      this.save.emit(saveData)
    }
  }  
}
