import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  private configuration = '${APP_CONFIG}';
  private env: any;
  private nodeEnvironment: string;

  constructor() {
    this.nodeEnvironment =
      this.configuration === '' || this.configuration.startsWith('$')
        ? ''
        : `.${this.configuration}`;
    this.env = require('../../environments/environment' + this.nodeEnvironment);
  }

  get config() {
    return this.env.environment;
  }

  get nodeEnv() {
    return this.nodeEnvironment;
  }
}
