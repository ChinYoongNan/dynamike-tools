import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';


let configuration = '${APP_CONFIG}';
let nodeEnvironment = configuration === '' || configuration.startsWith('$') ? '' : `.${configuration}`;
let env = require('./environments/environment' + nodeEnvironment);


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));


// function addMeta(n, c) {
//   let Meta = document.createElement('meta');
//   Meta.name = n; Meta.content = c;
//   document.getElementsByTagName('head')[0].appendChild(Meta)
// }
// function addScript(t, s, c?) {
//   let Script = document.createElement('script');
//   Script.type = t; s ? Script.src = s : ""; c ? Script.className = c : "";
//   document.getElementsByTagName('head')[0].appendChild(Script)
// }
// function setTrust(m, s) {
//   m.forEach((r) => { addMeta(r.name, r.content) })
//   s.forEach((r) => { addScript(r.type, r.src ? r.src : "", r.cls ? r.cls : "") })
// }
