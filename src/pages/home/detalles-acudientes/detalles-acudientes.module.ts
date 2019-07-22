import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetallesAcudientesPage } from './detalles-acudientes';

@NgModule({
  declarations: [
    DetallesAcudientesPage,
  ],
  imports: [
    IonicPageModule.forChild(DetallesAcudientesPage),
  ],
})
export class DetallesAcudientesPageModule {}
