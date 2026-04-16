import { bootstrapApplication } from '@angular/platform-browser';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { initializeApp, getApps } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from '@firebase/app-check';
import { environment } from './environments/environment';
import { firebaseConfig, recaptchaSiteKey } from './environments/firebaseConfig';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

// Initialize Firebase and App Check before Angular bootstrap
if (getApps().length === 0) {
  const app = initializeApp(firebaseConfig);
  if (recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    });
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      FormsModule,
      ReactiveFormsModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireDatabaseModule,
      DragDropModule
    )
  ]
}).catch(err => console.error(err));
