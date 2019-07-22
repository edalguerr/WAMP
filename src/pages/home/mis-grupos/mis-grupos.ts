import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MiGentePage } from '../mi-gente/mi-gente';
import * as firebase from 'Firebase';
import { AddRoomPage } from '../../add-room/add-room';
import { RoomPage } from '../../room/room';
import { UserProvider } from '../../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-mis-grupos',
  templateUrl: 'mis-grupos.html',
}) 

export class MisGruposPage {
  buscando:boolean;
  rooms = [];
  items;
  ref = firebase.database().ref('chatrooms/');
  imagenes = ['blackboard(1)','business(1)','chemistry(1)','family(1)','meeting(1)','presentation(1)','science(1)']
  indConflict = [0,1,7,8] ; //indices conflictivos para arreglo de imagenes, ya que esta asignado loop = "true" en el slide de imagenes
  searchQuery: string = '';  //al registrar un grupo                        
  
  constructor( public userProvider:UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    
    this.buscando = true;
    this.ref.on('value', resp => {
      this.rooms = [];
      this.rooms = snapshotToArrayFilter(resp, this.userProvider.nroCelular);
      this.items = this.rooms;
    });  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MisGruposPage');
    this.buscando = false;
  }
  
  activarBarra(){
    this.buscando = true;
  }

  onCancel($event){
    this.buscando = false;
  }

  irMiGente(){
    this.navCtrl.push(MiGentePage);
  }

  addRoom() {
    this.navCtrl.push(AddRoomPage);
  }

  joinRoom(key, room) {
    this.navCtrl.push(RoomPage, {
      key:key,
      nickname: this.navParams.get('nickname'),
      roomname:room.roomname,
      integrantes: room.acudientes,
      administrador: room.administrador
    });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.items = this.rooms;

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        if((item.roomname.toLowerCase().indexOf(val.toLowerCase()) > -1)){
          return item
        }    
      })
    }
  }

}

export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};

export const snapshotToArrayFilter = (snapshot, nroCelular) => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      
      
      item.acudientes.forEach(acudiente => {
        if(acudiente.celular == nroCelular){
          returnArr.push(item);
        }
      })    
  });

  return returnArr;
};