function device_download_plugins(filename, data, mimeType) {
    var blob = new Blob([data], {
      type: mimeType
    });
    
    if (window.cordova && window.cordova.platformId !== "browser") {
       document.addEventListener("deviceready", function() {
        var storageLocation = "";  
        console.log(window.cordova);
        switch (window.cordova.platformId) {
          case "android":
            storageLocation = window.cordova.file.externalDataDirectory;
            break;  
          case "iOS":
            storageLocation = window.cordova.file.documentsDirectory;
            break;
        }
        // window.cordova.plugins.notification.local.schedule({
        //     title: 'The big survey',
        //     text: 'Are you a fan of RB Leipzig?',
        //     // attachments: [file],
        //     actions: [
        //         { id: 'yes', title: 'Yes' },
        //         { id: 'no',  title: 'No' }
        //     ]
        // });
        var folderPath = storageLocation;
        window.resolveLocalFileSystemURL(
          folderPath,
          function (dir) {
            dir.getFile(
              filename,
              {
                create: true
              },
              function (file) {
                file.createWriter(
                  function (fileWriter) {
                    fileWriter.write(blob);
  
                    fileWriter.onwriteend = function () {
                      var url = file.toURL();
                      cordova.plugins.fileOpener2.open(url, mimeType, {
                        error: function error(err) {
                          console.error(err);
                          alert("Unable to download");
                        },
                        success: function success() {
                          console.log("success with opening the file");
                        }
                      });
                    };
  
                    fileWriter.onerror = function (err) {
                      alert("Unable to download");
                      console.error(err);
                    };
                  },
                  function (err) {
                    // failed
                    alert("Unable to download");
                    console.error(err);
                  }
                );
              },
              function (err) {
                alert("Unable to download");
                console.error(err);
              }
            );
          },
          function (err) {
            alert("Unable to download");
            console.error(err);
          }
        );
      });
    } 
  }
  function isbrowser() {
    if (window.cordova && window.cordova.platformId !== "browser") {
        return false;
    } else {
      return true;
    }
  }