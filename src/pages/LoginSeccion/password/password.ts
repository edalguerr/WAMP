import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../../providers/user/user';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ToastController } from 'ionic-angular';
import { UsuariosProvider } from '../../../providers/usuarios/usuarios';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {
  
  constructor(public oneSignal:OneSignal, public navCtrl: NavController, public navParams: NavParams, private user:UserProvider, private afAuth:AngularFireAuth, public alertCtrl: AlertController, private toastCtrl: ToastController, public usuariosProvider:UsuariosProvider) {
    this.user.password="";
    this.user.passwordVeri="";
   // console.log(this.afAuth.user);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
  }

  register(user:UserProvider){
    if((user.password == user.passwordVeri) && (user.password != "" && user.passwordVeri != "")){

        this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password).then((data)=>{
          this.showAlert("Registro exitoso","Bienvenido a nuestra comunidad, nuestros servicios están a su disposicion");
          this.usuariosProvider.crearUsuario(user);
          this.oneSignal.sendTags({email: user.email, celular: user.nroCelular});
          this.navCtrl.setRoot(LoginPage);

        }).catch((error)=>{

          if(error.code == "auth/invalid-email"){
            this.presentToast("El email ingresado es invalido")
            this.navCtrl.pop();
          }
          else if(error.code == "auth/weak-password"){
            this.presentToast("La contrasea debe tener minimo 6 caracteres")
          }  
          else if(error.code == "auth/email-already-in-use"){
            console.log(error)
            this.presentToast("El email ingresado ya está en uso")
            this.navCtrl.pop();
          }
          console.log(error)
          console.error(error);
        })
    }
    else{
      if((user.password != user.passwordVeri) && (user.password != "" && user.passwordVeri != ""))
       this.presentToast('Las constraseñas no coinciden, asegurese de escribirlas correctamente');
      else if(user.password == "" && user.passwordVeri == "") 
      this.presentToast('Ingrese su contraseña');
      //this.showAlert('Uups!','Las constraseñas no coinciden, asegurese de escribirlas correctamente');
    }
  }

  showAlert(_title, _subtitle) {
    let alert = this.alertCtrl.create({
      title: _title,
      subTitle: _subtitle,
      buttons: ['OK']
    });
    alert.present();
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Cancelar registro',
      message: '¿Seguro que desea cancelar su registro?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Si',
          handler: () => {
            this.user.email="";
            this.user.password="";
            this.navCtrl.setRoot(LoginPage);
          }
        }
      ]
    });
    confirm.present();
  } 
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      duration: 5000
    });
  
    toast.present();
  }

  Cancel(){
    this.showConfirm();
  }
}
