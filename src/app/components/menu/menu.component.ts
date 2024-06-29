import { Component, OnInit, HostListener } from '@angular/core';

import { CommonService } from "../../services/common.service";

import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';
import { AccountService } from '../../services/account.service';

import { ROUTES, navItems } from "./../../app.routing";
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  
  navList: any[];
  Selected: number;
  constructor(
    private common: CommonService,
    private router: Router,
    private appcomponent: AppComponent,
    private accountService: AccountService
  ) { }

  navItems = navItems;
  
  isCollapsed = false;
  isReverseArrow = false;
  width = 200;
  ngOnInit(): void {
    console.log(ROUTES);
  }

  click(n) {
    this.appcomponent.isCollapsed = true;
    this.router.navigateByUrl(n);
    window.scrollTo(0, 0)
  }

  // @HostListener('window:keydown', ['$event'])
  // spaceEvent(event: any) {
  //     if(event.keyCode == 18) // HOME
  //       this.click(27)
       
  // }



}
