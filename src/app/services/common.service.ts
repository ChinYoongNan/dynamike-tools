import { Injectable } from '@angular/core';

import { AngularCsv } from 'angular-csv-files/Angular-csv';
import { nodeName } from 'jquery';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { title } from 'process';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from "moment";
import { Router, NavigationEnd } from '@angular/router'
import { CashierDialogComponent } from '../components/util/cashierDialog/cashier_dialog.component';
@Injectable({
  providedIn: 'root'
})


export class CommonService {

  private history: string[] = []
  constructor(private message: NzMessageService, private modal: NzModalService,private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
    })
   }

  getModal(){
    return this.modal;
  }
  createBasicMessage(text) {

    return this.message.info(text, { nzDuration: 3000 }).messageId;

  }

  setItem(k, v) {

    sessionStorage.setItem(k, v);

  }

  removeItem(k) {

    sessionStorage.removeItem(k);

  }

  getItem(k) {

    return sessionStorage.getItem(k)

  }

  formatImage(img: any): any {
    // img = '1oVXKcnnkOMxi7DU5oFGQx4URSlhUZwvA';
    return 'https://drive.google.com/thumbnail?id=' + img;
    // if(img){
    //   return 'data:image/jpeg;base64,' + img;
    // }
  }

  
  convertDataURIToBinary(dataURI) {
    var base64Index = dataURI.indexOf(';base64,') + ';base64,'.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
  
    for(var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  getListFromBE(objList){    
    if(objList['content']){
      return objList.content;
    }else{
      return objList;
    }
  }

  validatefldNumber(val){
    return (isNaN(parseFloat(val)) || val != undefined || val != null)
  }
  
  fldIntValue (val) {
    if (val !== null && val !== '' && typeof val !== 'undefined') {
      return val
    } else {
      return ''
    }
  }

  fldValue (val) {
    if (val !== null && val !== '' && typeof val !== 'undefined') {
      return val.trim()
    } else {
      return ''
    }
  }

  
  resizeImage(file:File, maxWidth:number, maxHeight:number):Promise<Blob> {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.src = URL.createObjectURL(file);
        image.onload = () => {
            let width = image.width;
            let height = image.height;
            
            if (width <= maxWidth && height <= maxHeight) {
                resolve(file);
            }

            let newWidth;
            let newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            let canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;

            let context = canvas.getContext('2d');

            context.drawImage(image, 0, 0, newWidth, newHeight);

            canvas.toBlob(resolve, file.type);
        };
        image.onerror = reject;
    });
}

  createModalMessage(title, text) {
    let modal = this.modal;
    return {
      success: function () {
        modal.success({
          nzTitle: title,
          nzContent: text
        });
      },
      info: function () {
        modal.info({
          nzTitle: title,
          nzContent: text
        })
      },
      error: function () {
        modal.error({
          nzTitle: title,
          nzContent: text
        })
      },
      warning: function () {
        modal.warning({
          nzTitle: title,
          nzContent: text
        });
      }
    }
  }

  createModalMessageWithParam(title, template, param) {
    let modal = this.modal;
    return {
      confirm: function (){
        modal.confirm({
          nzTitle: title,
          nzContent: CashierDialogComponent,
          nzComponentParams: param,
          nzOnOk: () => console.log('OK')
        })
      },      
      success: function () {
        modal.success({
          nzTitle: title,
          nzContent: CashierDialogComponent,
          nzComponentParams: param
        });
      },
      info: function () {
        modal.info({
          nzTitle: title,
          nzContent: template
        })
      },
      error: function () {
        modal.error({
          nzTitle: title,
          nzContent: template
        })
      },
      warning: function () {
        modal.warning({
          nzTitle: title,
          nzContent: template
        });
      }
    }
  }

  sortFn(a, b) {

    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;

  }


  copy(id) {

    var newElem = document.getElementById(id);
    var range = document.createRange();
    range.selectNode(newElem);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    var successful = document.execCommand('copy');
    window.getSelection().removeAllRanges();
    return successful;

  }

  print(id, css) {

    var jubuData = document.getElementById(id).innerHTML;
    let newWin = window.open();
    newWin.document.body.innerHTML = css + jubuData;
    newWin.print();
    newWin.close();

  }

  csv(id, name: string) {
    let headers = [], data = [], collen = 0, rowlen = 0;

    let trs = document.getElementById(id).getElementsByTagName("tr");
    collen = Array.from(trs[0].getElementsByTagName("th")).length;
    for (let i = 0; i < collen; i++) {
      headers.push(trs[0].getElementsByTagName("th")[i].innerText)
    }
    rowlen = Array.from(trs).length - 1;
    let dataRow = [], dataRowObj = {};
    for (let i = 1; i < rowlen; i++) {
      dataRowObj = {}; dataRow = [];
      for (let j = 0; j < collen; j++) {
        dataRow.push(trs[i].getElementsByTagName("td")[j].innerText)
      }
      dataRowObj = { ...dataRow };
      data.push(dataRowObj)
    }

    data.push({ text: '' });
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      title: 'POS System',
      useBom: true,
      noDownload: false,
      headers: headers,
      nullToEmptyString: true,
    };

    new AngularCsv(data, name, options);
  }


  lang = "zh";
  timeCount: boolean = false;
  statusList_en = {
    400: "We're experiencing an error. Please try later.",
    404: "We're experiencing an error. Please try later.",
    500: "We're experiencing an error. Please try later.",
    503: "We're experiencing an error. Please try later."
  }
  statusList_zh = {
    400: "400 (参数错误) 发出的参数错误。",
    404: "404 (未找到) 服务器找不到请求的网页。",
    500: "500 (服务器内部错误) 服务器遇到错误，无法完成请求。",
    503: "503 (服务不可用) 服务器目前无法使用（由于超载或停机维护)。"
  }
  errStatus(id, text?) {
    return
    if (this.timeCount) { return } else { this.timeCount = true; setTimeout(() => { this.timeCount = false }, 3000) }
    if (this.lang == "en" && this.statusList_en[id])
      this.createModalMessage('error', this.statusList_en[id]).error()
    else if (this.statusList_zh[id])
      this.createModalMessage('error', this.statusList_en[id]).error()
    else
      this.createModalMessage('error', "We're experiencing an error. Please try later.").error()

  }
  
  backPreviousPage(): void {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl('/')
    }
  }

  notifyChild(event,data){
    event.next(data)
  }

  formValidation(form:FormGroup){
    if (form.invalid) {      
      Object.values(form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return true;
    }
  }
  formatDateZone(value){
    return moment.parseZone(value).format('YYYY-MM-DD')
  }
  
  
  formatClockInAMPM(value){
    return moment.parseZone(value).format('HH:mm a')
  }
  formatClockInTimeZone(value){
    return moment.parseZone(value).format()
  }

  formatTimeZone(value){
    return moment.parseZone(value).format('YYYY-MM-DD HH:mm a')
  }
  
  formatDatePicker(value: Date, format){
    switch(format){
      case 'Month':{
        return moment(value).month() + 1;
      }
      case 'Year':{
        return moment(value).year();
      }
      case 'Date':{
        return moment(value).date();
      }
    }
  }
  imageError: string;
  isImageSaved: boolean;
  cardImageBase64: string;
  filename:File;
  byteArray;
  imageFile : File;
  fileChangeEvent(fileInput: any) {
      this.imageError = null;
      if (fileInput.target.files && fileInput.target.files[0]) {
        this.imageFile = fileInput.target.files[0];
          // Size Filter Bytes
          const max_size = 20971520;
          const allowed_types = ['image/png', 'image/jpeg'];
          const max_height = 15200;
          const max_width = 25600;

          if (fileInput.target.files[0].size > max_size) {
              this.imageError =
                  'Maximum size allowed is ' + max_size / 1000 + 'Mb';

              return false;
          }

          // if(!fileInput.target.files[0].type.includes(allowed_types)){
          //   console.log('error');
          //     this.imageError = 'Only Images are allowed ( JPG | PNG )';
          //     return false;
          // }
          let byteArray;
          const reader = new FileReader();
          reader.onload = (e: any) => {
              const image = new Image();
              image.src = e.target.result;
              image.onload = rs => {
                  const img_height = rs.currentTarget['height'];
                  const img_width = rs.currentTarget['width'];



                  if (img_height > max_height && img_width > max_width) {
                      this.imageError =
                          'Maximum dimentions allowed ' +
                          max_height +
                          '*' +
                          max_width +
                          'px';
                      return false;
                  } else {
                      const imgBase64Path = e.target.result;
                      this.cardImageBase64 = imgBase64Path;
                      this.isImageSaved = true;
                      this.byteArray = this.convertDataURIToBinary(reader.result);
                      // this.previewImagePath = imgBase64Path;
                  }
              };
          };

          // reader.addEventListener("loadend", function () {
          //   // convert image file to base64 string
          //   console.log('base64', reader.result);
          //   this.byteArray = this.convertDataURIToBinary(reader.result);
          //   console.log('byte array', this.byteArray);
          // }, false);
    

          reader.readAsDataURL(fileInput.target.files[0]);
      }
  }
}


