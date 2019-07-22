import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireObject, AngularFireList } from 'angularfire2/database';

import { AcudientesProvider } from '../../../../providers/acudientes/acudientes';
import { UserProvider } from '../../../../providers/user/user';
import { UsuariosProvider } from '../../../../providers/usuarios/usuarios';
import { MiGenteProvider } from '../../../../providers/mi-gente/mi-gente';
import { DataSnapshot } from 'angularfire2/database/interfaces';

@IonicPage()
@Component({
  selector: 'page-formulario-acudiente',
  templateUrl: 'formulario-acudiente.html',
})
export class FormularioAcudientePage {
  iconContacto;
  alias = "";
  celular = null;
  taskRef:AngularFireObject<any> = null;
  
  constructor(public toastCtrl: ToastController, public usuariosProvider:UsuariosProvider ,public navCtrl: NavController, public navParams: NavParams, public acudientesProvider:AcudientesProvider, public userProvider:UserProvider) {
    //alert(this.userProvider.nroCelular);
    this.iconContacto =3;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormularioAcudientePage');
  } 

  public agregarAcudiente(){
    if(this.alias != "" && this.celular != null){
      this.taskRef = this.usuariosProvider.getUsuario(this.celular);
      //encontró el objeto
      if(this.taskRef != null){

        this.taskRef.query.ref.on('value', (itemsnapshot:DataSnapshot)=>{
          if(!itemsnapshot.exists()){
            this.presentToast("El número celular ingresado no se ha encontrado, intentelo de nuevo");
          }
          
          this.acudientesProvider.agregarAcudiente(this.userProvider.nroCelular, {nroCelular: this.celular, 
            alias: this.alias, 
            nombre: itemsnapshot.val().nombre, 
            apellidos: itemsnapshot.val().apellidos,
            email: itemsnapshot.val().email,
            imagen: this.iconContacto
          });
          this.presentToast("Felicidades, agregaste a "+this.alias+"  a tu circulo de acudientes")
          this.navCtrl.pop();
        })

        

      }//cierre del if
      else{
        this.presentToast("El número celular ingresado no se ha encontrado, intentelo de nuevo")
      }
    }//cierre del if externo o inicial
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
  
    toast.present();
  }
  
  seleccionado(){
    //this.presentToast(document.getElementById('primero').className)
  document.getElementById('primero').style.background = 'url(assets/checkmark.png) 50% 50%, url(assets/student.png) 50% 50% no-repeat';
  document.getElementById('segundo').style.background = 'url(assets/girl.png) 50% 50% no-repeat';
  document.getElementById('tercero').style.background = 'url(assets/user-silhouette.png) 50% 50% no-repeat';
  }

  seleccionado1(){
    document.getElementById('primero').style.background = 'url(assets/student.png) 50% 50% no-repeat';
    document.getElementById('segundo').style.background = 'url(assets/checkmark.png) 50% 50%, url(assets/girl.png) 50% 50% no-repeat';
    document.getElementById('tercero').style.background = 'url(assets/user-silhouette.png) 50% 50% no-repeat';
  }

  seleccionado2(){
    document.getElementById('primero').style.background = 'url(assets/student.png) 50% 50% no-repeat';
    document.getElementById('segundo').style.background = 'url(assets/girl.png) 50% 50% no-repeat';
    document.getElementById('tercero').style.background = 'url(assets/checkmark.png) 50% 50%, url(assets/user-silhouette.png) 50% 50% no-repeat';
  }
}
