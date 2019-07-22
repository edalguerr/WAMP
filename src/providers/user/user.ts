//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class UserProvider {
  email:string ="";
  password:string = "";
  passwordVeri:string ="";
  nroCelular;
  nombre:string = "";
  apellidos:string = "";
  
  //public http: HttpClient
  constructor() {
    console.log('Hello UserProvider Provider');
  }

}
