import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MiGentePage } from './mi-gente';

@NgModule({
  declarations: [
    MiGentePage,
  ],
  imports: [
    IonicPageModule.forChild(MiGentePage),
  ],
})
export class MiGentePageModule {}
