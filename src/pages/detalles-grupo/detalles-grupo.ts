import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { OneSignal } from '@ionic-native/onesignal';
import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'Firebase';

@IonicPage()
@Component({
  selector: 'page-detalles-grupo',
  templateUrl: 'detalles-grupo.html',
})
export class DetallesGrupoPage {
  acudientes;
  administrador;
  tasksRef:AngularFireObject<any>;
  nombreAdmi;
  roomkey;
  ref;
  nombreGrupo;
 
  constructor(public alertCtrl: AlertController, public aFDB: AngularFireDatabase, private oneSignal: OneSignal, private usuariosProvider:UsuariosProvider, private user:UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.acudientes = this.navParams.get('integrantes')
    this.administrador = this.navParams.get('administrador')
    this.roomkey = this.navParams.get("roomkey") as string;
    this.nombreGrupo = this.navParams.get("nombreRoom")

    this.oneSignal.getTags().then((tags)=>{
      //obtener datos de usuario        
      this.user.nroCelular = tags.celular;    
      this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
      this.tasksRef.query.ref.on('value',itemSnapShot=>{
        this.user = itemSnapShot.val()  
    })  
   })

   this.acudientes.forEach(element => {
     if(element.celular == this.administrador){
      this.nombreAdmi = element.nombre;
     }
   });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetallesGrupoPage');
  }

  eliminarGrupo(){
    //this.ref = firebase.database().ref('chatrooms/'+this.roomkey);
    //this.ref.remove();
    let confirm = this.alertCtrl.create({
      title: 'Eliminar grupo',
      message: '¿seguro que desea eliminar el grupo?',
      buttons: [
        {
          text: 'cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'eliminar',
          handler: () => {
            this.aFDB.database.ref('chatrooms/'+this.roomkey).remove();
            this.navCtrl.pop();
            this.navCtrl.pop();
          }
        }
      ]
    });
    confirm.present(); 
  }

  salirGrupo(){
    let acud = [];
    this.acudientes.forEach( item =>{
      if(item.celular != this.user.nroCelular){
        acud.push(item)
      }
    })
    //modificando lista de acudientes
    this.aFDB.database.ref('chatrooms/'+this.roomkey+'/acudientes').set(acud);
    
    //enviando mensaje de aviso que se ha abandonado el grupo
      let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
      newData.set({
        type:'exit',
        user: this.user.nombre,
        message: this.user.nombre + ' ha abandonado el grupo',
        sendDate:Date()
      });
    
    this.navCtrl.pop();
    this.navCtrl.pop();
  }

  vaciarChat(){
    let confirm = this.alertCtrl.create({
      title: 'Vaciar chat',
      message: '¿seguro que desea borrar la conversacion?',
      buttons: [
        {
          text: 'cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'vaciar',
          handler: () => {
            let acud = [];
            this.acudientes.forEach( item =>{
              if(item.celular == this.user.nroCelular){
                acud.push({celular:item.celular, nombre:item.nombre, nroSesion: item.nroSesion, chats:[]})
              }
              else{
                acud.push(item);
              }
            }) 
            this.aFDB.database.ref('chatrooms/'+this.roomkey+'/acudientes').set(acud);
          }
        }
      ]
    });
    confirm.present(); 
   
  }
}
