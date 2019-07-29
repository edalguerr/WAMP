import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { OneSignal } from '@ionic-native/onesignal';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions,
        CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Vibration } from '@ionic-native/vibration';
import { CallNumber } from '@ionic-native/call-number';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Autostart } from '@ionic-native/autostart';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion';

//providers
import { UserProvider } from '../providers/user/user';
import { UsuariosProvider } from '../providers/usuarios/usuarios';
import { AcudientesProvider } from '../providers/acudientes/acudientes';
import { MiGenteProvider } from '../providers/mi-gente/mi-gente';

//Paginas de la app
import { MyApp } from './app.component';
import { LoginPage } from '../pages/LoginSeccion/login/login';
import { HomePage } from '../pages/home/home';
import { MenuHomePage } from '../pages/home/menu-home/menu-home';
import { EmailPage}  from '../pages/LoginSeccion/email/email';
import { NamePage} from '../pages/LoginSeccion/name/name';
import { PasswordPage } from '../pages/LoginSeccion/password/password';
import { PerfilPage } from '../pages/LoginSeccion/perfil/perfil';
import { RegisterPage } from '../pages/LoginSeccion/register/register';
import { ResetpasswordPage } from '../pages/LoginSeccion/resetpassword/resetpassword';
import { MisGruposPage } from '../pages/home/mis-grupos/mis-grupos';
import { MiGentePage } from '../pages/home/mi-gente/mi-gente';
import { DetallesAcudientesPage } from '../pages/home/detalles-acudientes/detalles-acudientes';
import { NotificacionPage } from '../pages/notificacion/notificacion';
import { FormularioAcudientePage } from '../pages/home/mi-gente/formulario-acudiente/formulario-acudiente';
import { RoomPage } from '../pages/room/room';
import { AddRoomPage } from '../pages/add-room/add-room';
import { DetallesGrupoPage } from '../pages/detalles-grupo/detalles-grupo';


var config = {
  apiKey: "tu apikey",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    MenuHomePage,
    EmailPage,
    NamePage,
    PasswordPage,
    PerfilPage,
    RegisterPage,
    ResetpasswordPage,
    MisGruposPage,
    MiGentePage,
    DetallesAcudientesPage,
    NotificacionPage,
    FormularioAcudientePage,
    RoomPage,
    AddRoomPage,
    DetallesGrupoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    MenuHomePage,
    EmailPage,
    NamePage,
    PasswordPage,
    PerfilPage,
    RegisterPage,
    ResetpasswordPage,
    MisGruposPage,
    MiGentePage,
    DetallesAcudientesPage,
    NotificacionPage,
    FormularioAcudientePage,
    RoomPage,
    AddRoomPage,
    DetallesGrupoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Vibration,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    UsuariosProvider,
    OneSignal,
    AcudientesProvider,
    MiGenteProvider,
    CallNumber,
    BackgroundMode,
    Autostart,
    DeviceMotion    
  ]
})
export class AppModule {}
