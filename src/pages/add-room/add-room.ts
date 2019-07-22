import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import * as firebase from 'Firebase';

import { MiGenteProvider } from '../../providers/mi-gente/mi-gente';
import { UserProvider } from '../../providers/user/user';
import { AngularFireObject } from 'angularfire2/database';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { OneSignal } from '@ionic-native/onesignal';

@IonicPage()
@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage {
  @ViewChild(Slides) slides: Slides;
  tasksRef:AngularFireObject<any>;
  data = { roomname:'' };
  ref = firebase.database().ref('chatrooms/');
  imagenes = ['blackboard(1)','business(1)','chemistry(1)','family(1)','meeting(1)','presentation(1)','science(1)']
  acudientes = [];
  integrantes:any;

  constructor(private oneSignal: OneSignal, private usuariosProvider:UsuariosProvider, private user:UserProvider, public miGenteProvider:MiGenteProvider, public navCtrl: NavController, public navParams: NavParams) {
    
    this.acudientes = this.miGenteProvider.acudientes;
    this.oneSignal.getTags().then((tags)=>{
      //obtener datos de usuario        
      this.user.nroCelular = tags.celular;    
      this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
      this.tasksRef.query.ref.on('value',itemSnapShot=>{
        this.user = itemSnapShot.val()  
    })  
   })

  }

  ionViewWillEnter(){
    this.acudientes = this.miGenteProvider.acudientes;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddRoomPage');
  }
  
  addRoom() {
    let newData = this.ref.push();
    let _acudientes:Array<{celular:any,nombre:any,nroSesion:any,chats:any}> = [];
    let agregadoYo:boolean = false;
    
    
    this.integrantes.forEach(inte =>{
     
      this.miGenteProvider.getCelularAcudientesInfo().forEach(item =>{
        if(inte == item.celular){
          
          //_acudientes.push(item);
          _acudientes.push({celular:item.celular, nombre:item.nombre, nroSesion: 0, chats:[]})
          if(inte == this.user.nroCelular){
            agregadoYo = true;
          }
        }
        return false;
      })
      return false;
    })
    
    if(agregadoYo == false){
      _acudientes.push({celular:this.user.nroCelular, nombre:this.user.nombre, nroSesion: 0, chats:[]})
    }
    
    newData.set({
      roomname: this.data.roomname,
      acudientes: _acudientes,
      imagen: this.slides.getActiveIndex(),
      administrador: this.user.nroCelular 
    });
    this.navCtrl.pop();
  }
}
