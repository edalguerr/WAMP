//import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UsuariosProvider {
  
  private usuarios = []
  //public http: HttpClient
  constructor(public aFDB: AngularFireDatabase) {
    console.log('Hello UsuariosProvider Provider');
  }
  

  public getUsuarios(){
     
    return this.aFDB.list("usuarios/");
  }

  public getUsuario(nroCelular){
   /* return this.notas.filter((e, i)=>{
      return e.id == id;
    })[0] || {id:null, title: null, description: null};*/
    
    return this.aFDB.object('usuarios/'+nroCelular);
  }

  public crearUsuario(user){
    //this.notas.push(nota);
    this.aFDB.database.ref('usuarios/'+user.nroCelular).set(user);
  }

public editarUsuario(user){
  /*for(let i = 0; i < this.notas.length; i++){
      if(this.notas[i].id == nota.id){
        this.notas[i] = nota;
      }
  }*/
  this.aFDB.database.ref('usuarios/'+user.nroCelular).set(user);
}

public deleteUsuario(user){
  /*for(let i = 0; i < this.notas.length; i++){
    if(this.notas[i].id == nota.id){
      this.notas.splice(i,1);
    }
}*/
this.aFDB.database.ref('usuarios/'+user.nroCelular).set("");
this.aFDB.database.ref('usuarios/'+user.nroCelular).remove();
}

}
