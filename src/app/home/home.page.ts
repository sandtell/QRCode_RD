import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import xml2js from 'xml2js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  public xmlToJson;
  public isShowHide:boolean = false;
  constructor(private barcodeScanner: BarcodeScanner) { }


  scanQR() {
    
    // Optionally request the permission early
    this.barcodeScanner.scan().then(barcodeData => {
      this.convertToJson(barcodeData.text);
      console.log('Barcode data', barcodeData);
     }).catch(err => {
        alert(JSON.stringify(err));
         console.log('Error', err);
     });
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
