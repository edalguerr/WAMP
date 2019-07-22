import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { PasswordPage} from '../password/password';
import { UserProvider } from '../../../providers/user/user';
import { UsuariosProvider } from '../../../providers/usuarios/usuarios';
import { AngularFireObject } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-email',
  templateUrl: 'email.html',
})
export class EmailPage {

  tasksRef:AngularFireObject<any>;
  usuario:{ email, password, passwordVeri, nroCelular, nombre, apellidos};

  constructor(public navCtrl: NavController, public navParams: NavParams, private user:UserProvider,private toastCtrl: ToastController, public usuariosProvider:UsuariosProvider) {
    this.user.email = "";
    this.user.nroCelular = null;
    console.log(this.usuario)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EmailPage');
  }

  pagePassword(){
   if(this.user.email != "" && this.user.nroCelular != null){
    this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
    this.tasksRef.query.ref.on('value',itemSnapShot=>{
       
        this.usuario = itemSnapShot.val();
        console.log(this.usuario);
        if(this.usuario != null){
          if(this.usuario.email == this.user.email){
            this.presentToast("El email ingresado ya está en uso");
          }
          else if(this.usuario.nroCelular == this.user.nroCelular){
            this.presentToast("El numero celular ingresado ya está en uso");
          }
          
        }
        else{
              this.navCtrl.push(PasswordPage);          
        } 
      })   
  }    
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
