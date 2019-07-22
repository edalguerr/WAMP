//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AcudientesProvider {
  //public http: HttpClient

  constructor(public aFDB: AngularFireDatabase) {
    console.log('Hello AcudientesProvider Provider');
  }
  
  public getAcudientes(celularUser){
    return this.aFDB.list("acudientes/"+celularUser+"/");
  }

  public getAcudiente(celularUser, nroCelular){
    return this.aFDB.object("acudientes/"+celularUser+"/"+nroCelular);
  }
 
  public agregarAcudiente(celularUser, acudiente:{nroCelular, alias, nombre, apellidos, email, imagen}){
   this.aFDB.database.ref("acudientes/"+celularUser+"/"+acudiente.nroCelular).set(acudiente);
  } 
  
  public editarAcudiente(celularUser, acudiente:{nroCelular, alias, nombre, apellidos, email, imagen}){
    this.aFDB.database.ref("acudientes/"+celularUser+"/"+acudiente.nroCelular).set(acudiente);
  }
  
  public eliminarAcudiente(celularUser, nroCelular){
    this.aFDB.database.ref("acudientes/"+celularUser+"/"+nroCelular).remove();
  }

  public agregarUsuario(nroCelular,informacion:{id:any}){
  this.aFDB.database.ref("identificadores/"+nroCelular).set(informacion)
  }

  public getUsuario(nroCelular){
    return this.aFDB.object("identificadores/"+nroCelular);
  }

}
