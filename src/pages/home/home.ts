import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';
import { AngularFireObject, AngularFireList } from 'angularfire2/database';
import { Geolocation, Coordinates } from '@ionic-native/geolocation';
import { BackgroundMode } from '@ionic-native/background-mode';
import { DeviceMotion, DeviceMotionAccelerationData, DeviceMotionAccelerometerOptions } from '@ionic-native/device-motion';

import { UserProvider } from '../../providers/user/user';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
import { MiGenteProvider } from '../../providers/mi-gente/mi-gente';
import { AcudientesProvider } from '../../providers/acudientes/acudientes';

import { PerfilPage } from '../LoginSeccion/perfil/perfil';
import { MisGruposPage } from './mis-grupos/mis-grupos';
import { MiGentePage } from './mi-gente/mi-gente';
import { Vibration } from '@ionic-native/vibration';


@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
}) 
export class HomePage {
  tasksRef:AngularFireObject<any>;
  taskRefList:AngularFireList<any>;
  primeraves:boolean = true;

  data: DeviceMotionAccelerationData;
  suscribtion: any;
  suscribtion2: any;
  limites:{x:any, y:any, z:any};
  

  //private backgroundMode: BackgroundMode
  constructor(private deviceMotion: DeviceMotion, public vibration: Vibration, public backGroundMode:BackgroundMode, private geolocation:Geolocation, public acudientesProvider:AcudientesProvider, public miGenteProvider:MiGenteProvider, private usuariosProvider:UsuariosProvider, private user:UserProvider, public navCtrl: NavController, public navParams: NavParams, private oneSignal: OneSignal, public toastCtrl: ToastController) {
    //alert("HOME")
    /*alert("is active: "+this.backgroundMode.isActive())
    alert("is enabled: "+this.backgroundMode.isEnabled())
    //activar ejecucion en segundo plano
    if(!this.backgroundMode.isActive() || !this.backgroundMode.isEnabled()){
      this.backgroundMode.overrideBackButton();
      this.backgroundMode.enable();
      alert("activamos ejecucion en segundo plano")
    }
    */
    this.limites = {x:19, y:19, z:19};
   
    this.backGroundMode.enable();

    this.backGroundMode.setDefaults({
      title:  'WampService',
      text:   'Executing background tasks.',
      silent: true
    });
  
    //this.backGroundMode.overrideBackButton();
   /* this.backGroundMode.on('enable').subscribe(()=>{
      alert("esta habilitado: " + this.backGroundMode.isEnabled())
    })*/

    //alert("esta habilitado: " + this.backGroundMode.isEnabled())
    //alert("esta activado: "+this.backGroundMode.isActive())
    //Habilite el inicio automático después del arranque
    

    this.oneSignal.getTags().then((tags)=>{
        //obtener datos de usuario        
        this.user.nroCelular = tags.celular;    
        this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
        this.tasksRef.query.ref.on('value',itemSnapShot=>{
          this.user = itemSnapShot.val()     

          this.oneSignal.getIds().then((ids)=>{
            this.acudientesProvider.agregarUsuario(this.user.nroCelular,{id:ids.userId}) 
          });
      })  
    })

    //iniciamos a detectar movimientos bruscos con el celular
    this.startWatching();
  }
  
  startWatching(){
    let options: DeviceMotionAccelerometerOptions = {
      frequency: 500
    }
    
    this.suscribtion = this.deviceMotion.watchAcceleration(options).subscribe((acceleration:DeviceMotionAccelerationData)=>{
      this.data = acceleration;
      if(Math.abs(this.data.z) >= this.limites.z || Math.abs(this.data.y) >= this.limites.y || Math.abs(this.data.x) >= this.limites.x){
        //alert('movimiento brusco');
        //alert('X: '+Math.abs(this.data.x) + ' - Y: '+Math.abs(this.data.y) + ' Z: '+Math.abs(this.data.z));
        //this.alertar();
        this.alertar();
      }
    });
  }

  stopWatching(){
    this.suscribtion.unsubscribe();
  }


  ionViewWillEnter(){
    
    this.taskRefList = this.acudientesProvider.getAcudientes(this.user.nroCelular);
    this.taskRefList.query.ref.on('value',(itemSnapShot)=>{
      this.miGenteProvider.acudientes = [];

      itemSnapShot.forEach(itemSnap=>{
        this.miGenteProvider.acudientes.push(itemSnap.val());
        return false;
      })
    });
  }

  ionViewDidLoad() {
    
    this.oneSignal.getTags().then((tags)=>{
      //obtener datos de usuario        
      this.user.nroCelular = tags.celular;    
      this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
      this.tasksRef.query.ref.on('value',itemSnapShot=>{
        this.user = itemSnapShot.val()  

        this.oneSignal.getIds().then((ids)=>{
          this.acudientesProvider.agregarUsuario(this.user.nroCelular,{id:ids.userId}) 
        });
        
    })  
  })

  } 

  irPerfil(){      
    this.navCtrl.push(PerfilPage,{usuario:this.user});
  }

  irMisGrupos(){
    this.navCtrl.push(MisGruposPage,{nickname:this.user.nombre});
  }

  irMiGente(){
    this.navCtrl.push(MiGentePage);
  }

  alertar(){
    this.geolocation.getCurrentPosition().then((resp)=>{
      this.sendNotification(resp.coords);  
    }).catch((error)=>{
      this.presentToast("ha ocurrido un error")
      this.presentToast(error.msg)
    })
    
  }

  sendNotification(coords:Coordinates){

    this.oneSignal.getIds().then((ids)=>{
           
      /*this.presentToast1("acudientes")
      for (let iterator of this.miGenteProvider.acudientes) {
        this.presentToast1(iterator.nombre)
      }*/

      let objUserId: AngularFireObject<any> = null;
      let usersIds = [ids.userId];
      
      for (let iterator of this.miGenteProvider.getCelularAcudientes()) {
        //this.presentToast1(iterator) 
        objUserId = this.acudientesProvider.getUsuario(iterator);
        objUserId.query.ref.on('value',(itemSnapShot)=>{
        usersIds.push(itemSnapShot.val().id)    
        })
      }
       
      this.presentToast("cantidad: "+usersIds.length)
      let obj:any = {
        headings: {en:  "¡ALERTA!"},
        contents: {en:  this.user.nombre + " necesita ayuda, es ¡URGENTE!"},
        include_player_ids: usersIds,//[ids.userId]
        data:{acudientes: this.miGenteProvider.getCelularAcudientes(), lat: coords.latitude, lng: coords.longitude, celular: this.user.nroCelular} //TO DO: //[this.user.nroCelular]
      }
      
      this.oneSignal.postNotification(obj).then(()=>{
        this.presentToast("alerta emitida");
      }).catch((error:Error)=>{
        this.presentToast("Error al enviar la notificacion: ");
        console.log(error);
      })
    });
    
  }

  sendNotificationInicial(coords:Coordinates){
    this.oneSignal.getIds().then((ids)=>{
           
      /*this.presentToast1("acudientes")
      for (let iterator of this.miGenteProvider.acudientes) {
        this.presentToast1(iterator.nombre)
      }*/

      let objUserId: AngularFireObject<any>;
      let usersIds = [];
      
      for (let iterator of this.miGenteProvider.getCelularAcudientes()) {
        //this.presentToast1(iterator)
        objUserId = this.acudientesProvider.getUsuario(iterator);
        objUserId.query.ref.on('value',(itemSnapShot)=>{
        usersIds.push(itemSnapShot.val().id)    
        })
      }
       
      
      let obj:any = {
        headings: {en:  "¡ALERTA!"},
        contents: {en:  this.user.nombre + " necesita ayuda, es ¡URGENTE!"},
        include_player_ids: usersIds,//[ids.userId]
        data:{acudientes: this.miGenteProvider.getCelularAcudientes(), lat: coords.latitude, lng: coords.longitude, celular: this.user.nroCelular} //TO DO: //[this.user.nroCelular]
      }
      
      this.oneSignal.postNotification(obj).then(()=>{
        this.presentToast("notificacion enviada");
      }).catch((error:Error)=>{
        
      })
    });
  }

  getTags(){
    
    this.oneSignal.getTags().then((tags)=>{
      this.presentToast1(tags.email);
      this.presentToast("foreach");
      for (let iterator of tags) {
        this.presentToast1(iterator);  
      }
      
    })
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 10000,
      position: 'bottom'
    });
    toast.present();
  }

  presentToast1(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }

}
