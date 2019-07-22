import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { EmailPage } from '../email/email';
import { UserProvider } from '../../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-name',
  templateUrl: 'name.html',
})
export class NamePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private user:UserProvider) {
    this.user.nombre="";
    this.user.apellidos="";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NamePage');
  }

  pageemail(){

    if(this.user.nombre != "" && this.user.apellidos != "")
    this.navCtrl.push(EmailPage);
  }
}
