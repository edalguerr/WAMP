import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions,
CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Geolocation, Coordinates, Geoposition } from '@ionic-native/geolocation';
import { MapType } from '@angular/compiler/src/output/output_ast';
import { CallNumber } from '@ionic-native/call-number';
import { AngularFireObject } from 'angularfire2/database';

import { AcudientesProvider } from '../../providers/acudientes/acudientes';
import { UserProvider } from '../../providers/user/user';

import { MenuHomePage } from '../home/menu-home/menu-home';

declare var google;

@IonicPage()
@Component({
  selector: 'page-notificacion',
  templateUrl: 'notificacion.html',
})
export class NotificacionPage {
  mapElement;
  //map:GoogleMap;
  map;
  coords;
  celular;
  alias;
  tasksRef:AngularFireObject<any>;

  directionsService: any = null;
  directionsDisplay: any = null;
  bounds: any = null;
  myLatLng: any;
  waypoints: any[];

  constructor(private user:UserProvider, public acudientesProvider:AcudientesProvider, private callNumber: CallNumber, public toastCtrl: ToastController,public navCtrl: NavController, public navParams: NavParams, private googleMaps:GoogleMaps, private geolocation:Geolocation) {
    this.alias = "paco";
    this.coords = this.navParams.get("coords")
    this.celular = this.navParams.get("celular")

    this.tasksRef = this.acudientesProvider.getAcudiente(this.user.nroCelular, this.celular);
    this.tasksRef.query.ref.on('value',(itemSnapShot)=>{
      this.alias = itemSnapShot.val().alias;
    })

    this.presentToast(this.alias+' ha emitido una alerta, al parecer está en problemas, puede necesitar tu ayuda.');
    
    //this.getPosition();
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.bounds = new google.maps.LatLngBounds();

    this.waypoints = [
      {
        location: { lat: 10.39606091844021, lng: -75.48692390614832 },
        stopover: true,
      }
    ];
  }

  ionViewDidLoad() {
    //this.presentToast("pagina cargada")
    //this.loadMap(this.coords);
    this.getPosition();
   /* this.geolocation.getCurrentPosition().then((resp)=>{
      this.loadMap(resp.coords);
     // this.presentToast("ubicacion obtenida")
     // this.presentToast("lat: "+resp.coords.latitude+", lng: "+resp.coords.longitude)
    }).catch((error)=>{
      this.presentToast("ha ocurrido un error")
      this.presentToast(error.msg)
    })*/
  }

  getPosition():any{
    this.geolocation.getCurrentPosition().then(response => {
      this.loadMap(response);
    })
    .catch(error =>{
      console.log(error);
    })
  }

  
  loadMap(position: Geoposition){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    console.log(latitude, longitude);
    
    // create a new map by passing HTMLElement
    let mapEle: HTMLElement = document.getElementById('map');
    console.log(mapEle)
    // create LatLng object
    this.myLatLng = {lat: latitude, lng: longitude};
    
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.myLatLng,
      zoom: 14
    });
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(document.getElementById('panel'));
    
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {    
      this.calculateRoute();
      let marker = new google.maps.Marker({
        position: this.myLatLng,
        map: this.map,                      //para el market del destino o de la persona que solicita ayuda
        label: {text:'yo', color:'white'}, //label: {text:'yo', color:'white', fontWeight: "bold", fontSize: "16px", fontFamily: 'Lucida Sans'},
        zIndex: 50,
        animation:'DROP'
      });
  
      mapEle.classList.add('show-map');
      marker.addListener('click', function() {
        alert('Aqui estoy')
      });
      
      
    });
  }

  
private calculateRoute(){
  //code
  this.bounds.extend(this.myLatLng);

  this.waypoints.forEach(waypoint => {
    var point = new google.maps.LatLng(waypoint.location.lat, waypoint.location.lng);
    this.bounds.extend(point);
  });

  this.map.fitBounds(this.bounds);

  this.directionsService.route({
    origin: this.myLatLng,
    destination: { lat: this.coords.latitude, lng: this.coords.longitude },//this.myLatLng,//new google.maps.LatLng(this.myLatLng.lat, this.myLatLng.lng),
    waypoints: this.waypoints,
    optimizeWaypoints: true,
    travelMode: google.maps.TravelMode.DRIVING,
    avoidTolls: true
  }, (response, status)=> {
    //render
    if(status === google.maps.DirectionsStatus.OK) {
      console.log(response);
      this.directionsDisplay.setDirections(response);
    }else{
      alert('Could not display directions due to: ' + status);
    }
  }); 
}
  /*
  loadMap(coords:Coordinates){
    this.mapElement = document.getElementById('map');
    let mapOptions:GoogleMapOptions = {
      camera:{
        target:{
          lat:coords.latitude,
          lng:coords.longitude
        },
        zoom: 17,
        tilt: 30
      } 
    }
    
    this.map = this.googleMaps.create(this.mapElement,mapOptions);
    document.getElementById("contenido").style.background = "url('../assets/tapiz.png')";

    this.map.one(GoogleMapsEvent.MAP_READY).then(()=>{
     
      //mapa cargado
      this.map.setTrafficEnabled(true);
      //this.map.setMapTypeId()
      //agregando marcador
      // animation:'DROP',
      this.map.addMarker({
        title: this.alias,
        icon:'red',
        position: {
          lat: coords.latitude,
          lng: coords.longitude
        }
      }).then((marker:Marker)=>{
        marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(()=>{
          alert('mi ubicacion')
        })
      })

    })
  }


  loadMap(coords:Coordinates){

    this.mapElement = document.getElementById('map');
    this.map = new google.maps.Map(this.mapElement,{
    center: {lat:coords.latitude, lng:coords.longitude},
    zoom: 12
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      let marker = new google.maps.Marker({
        position: {lat:coords.latitude, lng:coords.longitude},
        map: this.map,
        title: 'Mi ubicacion!'
      });
      this.mapElement.classList.add('show-map');
    });
  }
*/

  regresar(){
    this.navCtrl.setRoot(MenuHomePage)
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }

  llamar(){
    this.callNumber.callNumber(this.celular, true); 
  }
}
