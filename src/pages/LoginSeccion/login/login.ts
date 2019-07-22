import { Component, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { OneSignal } from '@ionic-native/onesignal';
import { AngularFireObject } from 'angularfire2/database';
import { AngularFireList } from 'angularfire2/database';

import { UserProvider } from '../../../providers/user/user';
import { UsuariosProvider } from '../../../providers/usuarios/usuarios';

import { RegisterPage} from '../register/register';
import { ResetpasswordPage} from '../resetpassword/resetpassword';
import { MenuHomePage } from "../../home/menu-home/menu-home";
import { HomePage } from '../../home/home';
import { Vibration } from '@ionic-native/vibration';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  
  //@ViewChild(Nav) myNav:Nav;
  tasksRefL: AngularFireList<any>;
  tasksRef:AngularFireObject<any>;
  constructor(public vibration: Vibration, public onesignal:OneSignal, public navCtrl: NavController, public navParams: NavParams, private afAuth:AngularFireAuth, private user:UserProvider, private toastCtrl: ToastController, public usuariosProvider:UsuariosProvider) {
    //this.vibration.vibrate(3000);
    this.onesignal.getTags().then((tags)=>{
      if(tags.active == 'true'){
        //obtener datos de usuario
       this.navCtrl.push(MenuHomePage);
       
      }     
    })
  }

  ionViewDidLoad() {
   console.log('ionViewDidLoad LoginPage');
    this.onesignal.getTags().then((tags)=>{
      if(tags.active == 'true'){
        //obtener datos de usuario
       this.navCtrl.push(MenuHomePage);
      }     
    })
  }

  login(user:UserProvider){
    if(user.email != "" && user.password != ""){

    this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then((data)=>{

      this.onesignal.getTags().then((tags)=>{
        
        //si fue el ultimo en registrarse o iniciar sesion
        if(tags.email != user.email){
          this.tasksRefL = this.usuariosProvider.getUsuarios();

          this.tasksRefL.query.ref.on('value',itemSnapShot => {

            itemSnapShot.forEach(itemSnap =>{
              
              if(itemSnap.val().email == user.email){
                this.user =itemSnap.val();

                //this.user.nroCelular = itemSnap.val().nroCelular;
                this.onesignal.sendTags({email: this.user.email, celular: this.user.nroCelular});
                this.navCtrl.push(MenuHomePage);
              }
              return false;
            })
           
          })
        }//cierre if validacion email
        else{
          this.navCtrl.push(MenuHomePage);
        }    
      });
      this.onesignal.sendTag("active","true"); 
    }).catch((error)=>{
      if(error.code == "auth/invalid-email" || error.code == "auth/user-not-found")
          this.presentToast("Usuario no registrado, asegurese de digitar los datos correctamente");
      else if(error.code == "auth/wrong-password")    
          this.presentToast("La contraseña ingresada es incorrecta")

      console.log("Error al iniciar de sesion")
      console.log(error);
      console.error();
    })
   }
    //this.myNav.setRoot(MenuHomePage);
  }

  register(){
    this.user.email = "";
    this.user.password = "";
    this.navCtrl.push(RegisterPage);
  }

  pageReset(){
     this.navCtrl.push(ResetpasswordPage);
   }

   presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'bottom',
      duration: 3000
    });
  
    toast.present();
  }
}
