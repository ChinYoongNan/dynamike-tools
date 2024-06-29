import { Component, OnInit } from '@angular/core';

import {
  faTwitter,
  faFacebookF,
  faLinkedinIn,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  fontAwesomeIcon = {
    faTwitter,
    faFacebookF,
    faLinkedinIn,
    faYoutube,
  };
  nowtime:string;

  constructor() {}

  ngOnInit() {
    this.nowtime = (new Date()).getFullYear().toString()
  }
}
