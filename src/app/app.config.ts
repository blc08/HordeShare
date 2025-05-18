import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAnalytics } from "firebase/analytics";

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()), 
    provideFirebaseApp(() => initializeApp({ 
      projectId: "hordeshare-5c7ad", 
      appId: "1:90351200255:web:a065a2355bf422131a29ca", 
      storageBucket: "hordeshare-5c7ad.firebasestorage.app", 
      apiKey: "AIzaSyD42Fn1dH74pBalu1z2xt2rrunXtUEQXuU", 
      authDomain: "hordeshare-5c7ad.firebaseapp.com", 
      messagingSenderId: "90351200255", 
      measurementId: "G-TTE347MVGC" 
    })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
  };

  // const firebaseConfig = {
  //   apiKey: "AIzaSyD42Fn1dH74pBalu1z2xt2rrunXtUEQXuU",
  //   authDomain: "hordeshare-5c7ad.firebaseapp.com",
  //   projectId: "hordeshare-5c7ad",
  //   storageBucket: "hordeshare-5c7ad.firebasestorage.app",
  //   messagingSenderId: "90351200255",
  //   appId: "1:90351200255:web:cc120cc0f832d5781a29ca",
  //   measurementId: "G-EG8J0LH7EL"
  // };
  
  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);