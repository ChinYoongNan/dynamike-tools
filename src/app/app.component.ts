import { Component, ElementRef } from '@angular/core';

import { CommonService } from "../app/services/common.service";
import { AccountService } from '../app/services/account.service';
declare const gapi: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private clientId:string = '474138561456-2nfsni7vnvbjt6jdiu0bp6712ed84ove.apps.googleusercontent.com';
    
  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  
  public auth2: any;
  public googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: that.clientId,
        cookiepolicy: 'single_host_origin',
        scope: that.scope
      });
      that.attachSignin(that.elementRef.nativeElement.firstChild);
    });
  }
  

public attachSignin(element) {
  let that = this;
  this.auth2.attachClickHandler(element, {},
    function (googleUser) {

      let profile = googleUser.getBasicProfile();
      console.log('Token || ' + googleUser.getAuthResponse().id_token);
      console.log('ID: ' + profile.getId());
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail());
      //YOUR CODE HERE


    }, function (error) {
      console.log(JSON.stringify(error, undefined, 2));
    });
}

  mobile =true;
  isCollapsed =true;
  title = 'pos-app';
  closeGuideHeader: boolean = false;
  nu: boolean = false;
  constructor(
    private elementRef: ElementRef,
    private common: CommonService,
    public accountService: AccountService
  ) {

  }

  ngOnInit() {  
    document.getElementById('main').style.display = "";
    document.getElementById('login').style.display = "none";
  }
  
  drawerVisisble =false;
  isVisible = false;

  
  get drawerTitle(): string {
    return `<i nz-icon nzType="user"></i>`+`Profile`;
  }

  showDefault(): void {
    this.open();
  }


  open(): void {
    this.drawerVisisble = true;
  }

  close(): void {
    this.drawerVisisble = false;
  }
  ngAfterViewInit() {
    // this.googleInit();
  }
  logout() {
    // this.user = null;
    this.accountService.logout();
    this.close();
    this.accountService.getCurrentUser().subscribe((session) => {
      // this.user = session
    })
  }
}

