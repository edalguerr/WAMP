//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class MiGenteProvider {
  //public http: HttpClient
  acudientes:Array<{nroCelular:any, alias:any, nombre:any, apellidos:any, email:any, imagen:any}> = [];

  constructor() {
    
  }

  public getCelularAcudientes(){
    let celulares:Array<any> = [];
    
    for (let iterator of this.acudientes) {
      celulares.push(iterator.nroCelular);
    }

    return celulares;
  }

  public getCelularAcudientesInfo(){
    let users:Array<{celular:any, nombre:any}> = [];
    
    for (let iterator of this.acudientes) {
      users.push({celular: iterator.nroCelular, nombre:iterator.nombre});
    }

    return users;
  }
  
}
