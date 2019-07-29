import { Component, ViewChild, platformCore} from '@angular/core';
import { Platform, Nav, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal } from '@ionic-native/onesignal';
import { Vibration } from '@ionic-native/vibration';
import * as firebase from 'firebase';
import { platformCoreDynamic } from '@angular/platform-browser-dynamic/src/platform_core_dynamic';
import { BackgroundMode } from '@ionic-native/background-mode';

import { LoginPage } from '../pages/LoginSeccion/login/login';
import { HomePage } from '../pages/home/home';
import { NotificacionPage } from '../pages/notificacion/notificacion';


//, platformCore, platformCore, platformCore, platformCore 
var config = {
  apiKey: "tu apikey",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
 
//<preference name="SplashScreenDelay" value="3000" />
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = LoginPage;
  id;
  token;
  sesionActiva;

  
  constructor( public backGroundMode:BackgroundMode, public vibration: Vibration, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private oneSignal: OneSignal, public toastCtrl: ToastController) {
    
   //LoginPage.prototype.myNav = this.nav;
    
   platform.ready().then(() => {
      //this.hideSplashScreen();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.oneSignal.startInit('','');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
      this.oneSignal.setSubscription(true);
            
      this.oneSignal.getIds().then((ids)=>{
        this.id = ids.userId;
        this.token = ids.pushToken;
      });

      //evento para notificacion recibida
      this.oneSignal.handleNotificationReceived().subscribe((data)=>{
        
        this.oneSignal.getTags().then((tags)=>{
          data.payload.additionalData.acudientes.forEach(element => {
            if(tags.celular == element){
              //obtener datos de usuario
              //this.presentToast("notificacion recibida");
              //this.vibration.vibrate([2000,1000,3000]);
              //this.vibration.vibrate([4000,1000,5000]);
              setTimeout ("this.vibration.vibrate([2000,500,4000]);", 3000);
              this.backGroundMode.isScreenOff().then(()=>{ 
                this.backGroundMode.wakeUp(); 
              });
              
            }
          });          
        })
        
        console.log(data);
        //aqui se realiza la verificacion
        //this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);
        //.notification.payload.title   .notification.payload.body     
      });
      
      //evento para notificacion abierta
      this.oneSignal.handleNotificationOpened().subscribe((data)=>{   
        this.oneSignal.getTags().then((tags)=>{
          data.notification.payload.additionalData.acudientes.forEach(element => {
            if(tags.celular == element){
              //obtener datos de usuario
              //this.presentToast("notificacion abierta");
              //this.vibration.vibrate(0);
              //this.navCtrl.push(NotificacionPage);
              //setTimeout ("this.vibration.vibrate(2000);", 5000); 
              //this.vibration.vibrate(3000)
              let datosAdd= data.notification.payload.additionalData;
              this.nav.setRoot(NotificacionPage,{
                coords: {
                  latitude: datosAdd.lat, 
                  longitude: datosAdd.lng
                }, 
                celular: datosAdd.celular
              })
            }
          });          
        })   
        
      });
      
      //<preference name="AutoHideSplashScreen" value="false" />
      this.oneSignal.endInit();
      //alert("styleDefault")
      statusBar.styleDefault();  
      //alert("hide")
      splashScreen.hide();
      //alert("fin")
    });
    firebase.initializeApp(config)

  }
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }
/*
  hideSplashScreen() {
    console.log('Hola'+this.splashScreen)
    if (this.splashScreen) {
    setTimeout(() => {
    this.splashScreen.hide();
    }, 100);
    }
  }*/
}

