# dynamike_tools

upgrade the npm version
========================
npm install -g npm@latest

install necessary library
=========================
npm install
npm install -g @angular/cli@14
npm install -g @angular-devkit/build-angular 

Start Server
=============
npm run build -- -c=prod

Configure for Android 
=======================
npm install -g cordova

cordova create dynamike com.dynamike.app DynamikeApp

cd dynamike

ng build --base-href . --output-path ../www/

cordova platform add android@10.1.2

cordova platform rm android

cd C:\Users\bysadmin\AppData\Local\Android\Sdk\tools\bin

sdkmanager --licenses

set JAVA_HOME=java_1.8, ANDROID_HOME

install gradle-6.2 and set path for C:\Gradle\gradle-6.2\bin


cordova build android

Exception
=========
cordova
Installed Build Tools revision 31.0.0 is corrupted. Remove and install again using the SDK Manager.
For Windows
	1. go to the location
 "C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0"
	2. find a file named d8.bat. This is a Windows batch file.
	3. rename d8.bat to dx.bat.
	4. in the folder lib ("C:\Users\user\AppData\Local\Android\Sdk\build-tools\31.0.0\lib")
rename d8.jar to dx.jar


cordova run android --no-native-run

cordova emulate android

Install cordova and build apk
=======================
npm install -g cordova
ng build --aot
cordova build android

Debug Android App
=======================
cordova run android --debug --target=YOURDEVICEIDHER
chrome://inspect/#devices

Release Android App
=======================
cordova build --release android


Configure for Desktop apps
==========================
refer this link https://fireship.io/lessons/desktop-apps-with-electron-and-angular/
npm install electron --save-dev

packing as exe file
====================
npm install electron-packager -g
npm install electron-packager --save-dev

window apps
===========
electron-packager . --platform=win32 --icon=build\dynamike.ico

Mac apps
===========
electron-packager . --platform=darwin


enable device file download
-add cordova into android platform
===================================
cd platform/android
cordova plugin add cordova-plugin-file-transfer