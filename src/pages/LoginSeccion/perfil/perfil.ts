import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private user:UserProvider,  private toastCtrl: ToastController) {
     this.user = this.navParams.get('usuario');
    // this.presentToast("perfil creado")
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    this.user = this.navParams.get('usuario');
   // this.presentToast("perfil cargado")
  }
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      duration: 5000
    });
  
    toast.present();
  }
}
