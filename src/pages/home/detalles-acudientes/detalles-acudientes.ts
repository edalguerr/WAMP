import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-detalles-acudientes',
  templateUrl: 'detalles-acudientes.html',
})
export class DetallesAcudientesPage {
  datosAcudiente;
  iconos = ['student','girl','user-silhouette'];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private user:UserProvider) {
    this.datosAcudiente = this.navParams.get("datos")
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallesAcudientesPage');
  }

}
