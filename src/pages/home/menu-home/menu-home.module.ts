import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuHomePage } from './menu-home';

@NgModule({
  declarations: [
    MenuHomePage,
  ],
  imports: [
    IonicPageModule.forChild(MenuHomePage),
  ],
})
export class MenuHomePageModule {}
