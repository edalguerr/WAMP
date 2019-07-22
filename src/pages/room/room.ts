import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, AlertController } from 'ionic-angular';
import * as firebase from 'Firebase';
import { snapshotToArray } from '../home/mis-grupos/mis-grupos';
import { DetallesGrupoPage } from '../detalles-grupo/detalles-grupo';
import { OneSignal } from '@ionic-native/onesignal';
import { UserProvider } from '../../providers/user/user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-room',
  templateUrl: 'room.html',
})
export class RoomPage {
  detallesActive: boolean;
  @ViewChild(Content) content: Content;
  data = { type:'', nickname:'', message:'' };
  chats = [];
  chats2 = [];
  roomkey:string;
  nickname:string;
  offStatus:boolean = false;
  roomname="mi grupo";
  nroSesion = 0;
  key;
  keyAcuds = [];
  ref;
  acudients = [];
  anfRef:AngularFireList<any>;

  constructor(private user:UserProvider, public navCtrl: NavController, public navParams: NavParams, public aFDB: AngularFireDatabase, private oneSignal: OneSignal) {
    this.chats2 = [];
    this.roomkey = this.navParams.get("key") as string;
    this.nickname = this.navParams.get("nickname") as string;
    this.roomname = this.navParams.get("roomname");
    this.detallesActive = false;
    this.data.type = 'message';
    this.data.nickname = this.nickname;
    
    //alert(this.nickname)
    this.oneSignal.getTags().then((tags)=>{
      //obtener datos de usuario        
      this.user.nroCelular = tags.celular;  
      this.ref = firebase.database().ref('chatrooms/'+this.roomkey+'/acudientes').on('value', resp => {
        this.acudients = [];
        this.keyAcuds = [];
        this.acudients = snapshotToArray(resp); 
        this.acudients.forEach(item =>{
          if(item.celular == this.user.nroCelular){
            this.key = item.key;
            //alert(this.key);
          } 
          else{
            this.keyAcuds.push(item.key);
          }
          return false;
        })
      });  
   })

   //inicializando chats2
    this.anfRef = this.aFDB.list('chatrooms/'+this.roomkey+'/acudientes/'+this.key+'/chats/');
      this.anfRef.query.ref.on('value', itemSnapShot =>{
        this.chats2 = [];
        itemSnapShot.forEach(itemSnap=>{
          
          this.chats2.push(itemSnap.val());
          return false;
        })
    })

    firebase.database().ref('chatrooms/'+this.roomkey+'/chats').on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp);

      this.anfRef = this.aFDB.list('chatrooms/'+this.roomkey+'/acudientes/'+this.key+'/chats/');
      this.anfRef.query.ref.on('value', itemSnapShot =>{
        this.chats2 = [];
        itemSnapShot.forEach(itemSnap=>{
          
          this.chats2.push(itemSnap.val());
          return false;
        })
      })

      setTimeout(() => {
        if(this.offStatus === false) {
          this.content.scrollToBottom(300);
        }
      }, 1000);
    });

    let acudientes = this.navParams.get('integrantes')
    let acud = [];
    //modificando el numero de inicios de sesion de cada usuario en el chat
    this.oneSignal.getTags().then((tags)=>{
      //obtener datos de usuario        
      this.user.nroCelular = tags.celular;    
      
      acudientes.forEach( item =>{
        //alert(item.celular)
        if(item.celular == this.user.nroCelular){
          //alert("entro al if")
          this.nroSesion = item.nroSesion;
          let chats = (this.nroSesion == 0)? []:item.chats;
          acud.push({celular:item.celular, nombre:item.nombre, nroSesion: 1+item.nroSesion, chats: chats})
        }
        else{
          acud.push(item);
          //alert("entro al else")
        }
      })

      acudientes = acud;
      //modificando lista de acudientes
      this.aFDB.database.ref('chatrooms/'+this.roomkey+'/acudientes').set(acudientes);
      
      if(this.nroSesion == 0){
        //enviamos mensaje de ingreso a grupo solo la primera ves
        let joinData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();
        joinData.set({
          type:'join',
          user:this.nickname,
          message:this.nickname+' se ha unido al chat',
          sendDate:Date()
        });

        let joinData2 = firebase.database().ref('chatrooms/'+this.roomkey+'/acudientes/'+this.key+'/chats').push();
        joinData2.set({
          type:'join',
          user:this.nickname,
          message:'te has unido al chat',
          sendDate:Date()
        });

        //enviando el mensaje a los chats de los otros acudientes
        this.keyAcuds.forEach(item =>{
          let joinData3 = firebase.database().ref('chatrooms/'+this.roomkey+'/acudientes/'+item+'/chats').push();
          joinData3.set({
            type:'join',
            user:this.nickname,
            message:this.nickname+' se ha unido al chat',
            sendDate:Date()
          });
        })
      }
   })
    
    this.data.message = '';   
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoomPage');
  }

  ionViewWillEnter(){
    this.detallesActive = false;
    //inicializando chats2
    this.anfRef = this.aFDB.list('chatrooms/'+this.roomkey+'/acudientes/'+this.key+'/chats/');
    this.anfRef.query.ref.on('value', itemSnapShot =>{
      this.chats2 = [];
      itemSnapShot.forEach(itemSnap=>{
        
        this.chats2.push(itemSnap.val());
        return false;
      })
    })
  }

  sendMessage() {
    
    let newData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push(); 
    newData.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });

    let newData2 = firebase.database().ref('chatrooms/'+this.roomkey+'/acudientes/'+this.key+'/chats').push();
    newData2.set({
      type:this.data.type,
      user:this.data.nickname,
      message:this.data.message,
      sendDate:Date()
    });

    //enviando el mensaje a los chats de los otros acudientes
    this.keyAcuds.forEach(item =>{
      let newData3 = firebase.database().ref('chatrooms/'+this.roomkey+'/acudientes/'+item+'/chats').push();
      newData3.set({
        type:this.data.type,
        user:this.data.nickname,
        message:this.data.message,
        sendDate:Date()
      });
    })
   
    this.data.message = '';
  }
  
  exitChat() {
    let exitData = firebase.database().ref('chatrooms/'+this.roomkey+'/chats').push();

    exitData.set({
      type:'exit',
      user:this.nickname,
      message:this.nickname+' ha dejado el chat',
      sendDate:Date()
    });
  
    this.offStatus = true;
   //this.navCtrl.pop();
    /*this.navCtrl.setRoot(RoomPage, {
      nickname:this.nickname
    });*/
  }
 
  ionViewWillLeave(){
   /*if(this.detallesActive != true){
      if(this.offStatus != true){
      
        //this.exitChat();
      } 
    }*/
  } 
   
  irDetalles(){
    this.detallesActive = true;
    this.navCtrl.push(DetallesGrupoPage,{integrantes: this.navParams.get('integrantes'),
    administrador: this.navParams.get('administrador'),
    roomkey: this.roomkey,
    nombreRoom: this.roomname
    })
  }

}
