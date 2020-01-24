import { Component } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import xml2js from 'xml2js';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public xmlToJson;
  public isShowHide:boolean = false;
  constructor(
        private barcodeScanner: BarcodeScanner,
        private toastCtrl: ToastController,
        ) { }


  scanQR() {
    
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torchOn: false,
      prompt: 'Place a barcode inside the scan area',
      resultDisplayDuration: 500,
      disableSuccessBeep: false
      // formats: 'QR_CODE,PDF_417 ',
      // orientation: 'landscape',
    };

    // Optionally request the permission early
    this.barcodeScanner.scan(options).then(barcodeData => {
      
      if (barcodeData.cancelled) {
        this.isShowHide = false;
         this.presentToast('Cancelled Scanning ☹️...');
      }else {
        this.isShowHide = true;
        this.convertToJson(barcodeData.text);
      }

     }).catch(err => {
        alert(JSON.stringify(err));
         console.log('Error', err);
     });
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  convertToJson(data: string): Object {
    let res;
    // setting the explicitArray option prevents a array structure
    // where every node/element is always wrapped inside an array
    // set it to true, and see for yourself what changes
    xml2js.parseString(data, { explicitArray: false }, (error, result) => {      
      if (error) {
        throw new Error(error);
      } else {
        this.isShowHide = true;
        res = result;
        this.xmlToJson = res;
        // alert(res.PrintLetterBarcodeData.$.uid);
      }
    });
    return res;
  }

  
  public convertToXml(rootObject:Object) {
    return new xml2js.Builder().buildObject(rootObject);
  }


}
