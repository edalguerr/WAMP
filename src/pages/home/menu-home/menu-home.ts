import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';
import { AngularFireObject } from 'angularfire2/database';

import { UserProvider } from '../../../providers/user/user';
import { UsuariosProvider } from '../../../providers/usuarios/usuarios';

import { HomePage } from '../../home/home';
import { PerfilPage } from '../../../pages/LoginSeccion/perfil/perfil';
import { LoginPage } from '../../LoginSeccion/login/login';

@IonicPage()
@Component({
  selector: 'page-menu-home',
  templateUrl: 'menu-home.html',
})
export class MenuHomePage {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  
  pages: Array<{title: string, component: any}>;
  tasksRef:AngularFireObject<any>;
  constructor(private usuariosProvider:UsuariosProvider, public navCtrl: NavController, public navParams: NavParams, private user:UserProvider, private onesignal:OneSignal) {
  
      // used for an example of ngFor and navigation
      this.pages = [
        { title: 'Home', component: HomePage },
      ];

      this.onesignal.getTags().then((tags)=>{
        //obtener datos de usuario        
        this.user.nroCelular = tags.celular;    
        this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
        this.tasksRef.query.ref.on('value',itemSnapShot=>{
          this.user = itemSnapShot.val()     
      })  
      })   
  }

  ionViewDidLoad() {
    /*//alert("ionViewDidLoad MenuHomePage")
    this.onesignal.getTags().then((tags)=>{
      //obtener datos de usuario        
      this.user.nroCelular = tags.celular;    
      this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
      this.tasksRef.query.ref.on('value',itemSnapShot=>{
        this.user = itemSnapShot.val()     
    })  
    })*/
  }

  ionViewWillEnter(){
    this.onesignal.getTags().then((tags)=>{
      //obtener datos de usuario        
      this.user.nroCelular = tags.celular;    
      this.tasksRef  = this.usuariosProvider.getUsuario(this.user.nroCelular);
      this.tasksRef.query.ref.on('value',itemSnapShot=>{
        this.user = itemSnapShot.val()     
    })  
    })
  }

  openPage(page) {

    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  ngAfterViewInit () {
    console.log(this.nav);
    // Ahora puedes utilizar el componente hijo
  }

  irPerfil(){      
    this.navCtrl.push(PerfilPage,{usuario:this.user});
  }

  cerrarSesion(){
    this.onesignal.sendTag("active","false");
    //this.onesignal.sendTags({active:"false"});
    this.user = {email:"",password:"",nroCelular:null,nombre:"",apellidos:"", passwordVeri:""};
    this.nav.setRoot(LoginPage);
  }

}
