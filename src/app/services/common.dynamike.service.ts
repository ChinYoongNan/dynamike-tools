import { Injectable } from '@angular/core';

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { DcrService } from "./dcr.service";
import { CommonService } from "./common.service";
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { catchError } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CommonDynamikeService {
  private _data = [];

  constructor() {}
  // constructor(private http: HttpClient,private dcrService: DcrService, 
  //   private common: CommonService) {}
  // loadSupplier(tableData, notify): Promise<any[]> {
  //   return new Promise<any[]>(resolve => {
  //     this.dcrService.getSupplier().subscribe(data => {
  //       this._data = Array.from(Object.keys(data), k => data[k]);
  //       if(notify){
  //         this.common.notifyChild(tableData,this._data) 
  //       }
  //       resolve(this._data);
  //     },    
  //     msg => { // Error
  //       this.common.createModalMessage(msg.error.error, msg.error.message).error()
  //     });
  //   });
  // } 

  public id:any;
  public getSelectedIndex(data){
    this.id = data;
  }
  public updateData:any;
  public getUpdatedData(data){
    this.updateData = data;
  }  

  public paginationData:any = {
    pageable:{
      pageNumber:0,
      pageSize:10
    }
  };
  public resetPagnitaionData(){
    this.paginationData = {
      pageable:{
        pageNumber:0,
        pageSize:10
      }
    }
  }

  public nextPageSetting(data, that:any = null, objFunction:any = null){
    console.log("nextPageSetting")
    this.paginationData = data;
    if(objFunction){
      objFunction(this.paginationData,that );
    }
    
  }

  // getSupplier(): Observable<any> {
  //   return this.dcrService.getSupplier()
  //     .pipe(map((resp: any) => resp.json()),
  //       catchError(error => this.throwError(error))
  //     )
  // }
  throwError(error: any) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error');
  }
}

