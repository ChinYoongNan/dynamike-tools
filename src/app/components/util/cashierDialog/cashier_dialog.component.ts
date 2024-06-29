import {Component, OnInit,Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-cashier-dialog',
  templateUrl: './cashier_dialog.component.html',
  styleUrls: ['./cashier_dialog.component.scss']
})
export class CashierDialogComponent implements OnInit {
  total;
  paid_money;
  changes_money;
  constructor() { }

  ngOnInit() {
  }

  init(){
  }
}
