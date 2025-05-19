import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';

import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  projectId: "hordeshare-5c7ad",
  appId: "1:90351200255:web:a065a2355bf422131a29ca",
  storageBucket: "hordeshare-5c7ad.firebasestorage.app",
  apiKey: "AIzaSyD42Fn1dH74pBalu1z2xt2rrunXtUEQXuU",
  authDomain: "hordeshare-5c7ad.firebaseapp.com",
  messagingSenderId: "90351200255",
  measurementId: "G-TTE347MVGC"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideFirebaseApp(() => initializeApp(firebaseConfig)),

    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
