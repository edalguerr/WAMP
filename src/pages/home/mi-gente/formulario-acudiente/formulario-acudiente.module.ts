import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FormularioAcudientePage } from './formulario-acudiente';

@NgModule({
  declarations: [
    FormularioAcudientePage,
  ],
  imports: [
    IonicPageModule.forChild(FormularioAcudientePage),
  ],
})
export class FormularioAcudientePageModule {}
