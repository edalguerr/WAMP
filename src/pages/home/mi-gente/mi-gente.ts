import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireList } from 'angularfire2/database';
import { CallNumber } from '@ionic-native/call-number';

import { DetallesAcudientesPage } from '../detalles-acudientes/detalles-acudientes';
import { FormularioAcudientePage } from './formulario-acudiente/formulario-acudiente';

import { MiGenteProvider } from '../../../providers/mi-gente/mi-gente';
import { AcudientesProvider } from '../../../providers/acudientes/acudientes';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-mi-gente',
  templateUrl: 'mi-gente.html',
})
export class MiGentePage {
  taskRefList:AngularFireList<any>;
  miGente:Array<any> = [];
  buscando:boolean;
  items;
  iconos = ['student','girl','user-silhouette'];

  constructor(private callNumber: CallNumber, public userProvider:UserProvider, public acudientesProvider:AcudientesProvider, public miGenteProvider:MiGenteProvider, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
    this.buscando = true;
  }
  
  ionViewWillEnter(){
    this.taskRefList = this.acudientesProvider.getAcudientes(this.userProvider.nroCelular);
    this.taskRefList.query.ref.on('value',(itemSnapShot)=>{
      this.miGenteProvider.acudientes = [];
      this.miGente = [];

      itemSnapShot.forEach(itemSnap=>{
        this.miGenteProvider.acudientes.push(itemSnap.val());
        return false;
      })

      this.miGente = this.miGenteProvider.acudientes;
      this.items = this.miGente;
      //this.miGente.sort();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MiGentePage');
    this.buscando = false;
  }
 
  activarBarra(){
    this.buscando = true;
  }

  onCancel($event){
    this.buscando = false;
  }


  irFormularioAcudiente(){
    this.navCtrl.push(FormularioAcudientePage)
  }

  irDetallesAcudiente(acudiente){
    this.navCtrl.push(DetallesAcudientesPage,{datos: acudiente});
  }

  showConfirm(acudiente) {
    let confirm = this.alertCtrl.create({
      title: 'eliminar acudiente',
      message: '¿Está seguro de querer eliminar el acudiente?',
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
            this.acudientesProvider.eliminarAcudiente(this.userProvider.nroCelular,acudiente.nroCelular);
          }
        }
      ]
    });
    confirm.present();
  }

  eliminar(acudiente){
    this.showConfirm(acudiente);
  }
  
  showPrompt(acudiente) {
    let prompt = this.alertCtrl.create({
      title: 'Alias',
      message: "Ingrese el nuevo alias a asignar",
      inputs: [
        {
          name: 'alias',
          placeholder: 'alias'
        },
      ],
      buttons: [
        {
          text: 'cancelar',
          handler: data => {
            
          }
        },
        {
          text: 'guardar',
          handler: data => {
            if(data.alias == ""){
              this.showAlert();
            }
            else{
              acudiente.alias = data.alias;
              this.acudientesProvider.editarAcudiente(this.userProvider.nroCelular,acudiente);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  editarAlias(acudiente){
    this.showPrompt(acudiente);
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Alias no actualizado',
      subTitle: 'no se ha ingresado un nuevo alias para este acudiente',
      buttons: ['OK']
    });
    alert.present();
  }

  llamar(acudiente){
    this.callNumber.callNumber(acudiente.nroCelular, true); 
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.items = this.miGente;

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        if((item.alias.toLowerCase().indexOf(val.toLowerCase()) > -1)){
          return item
        }    
      })
    }
  }

}
