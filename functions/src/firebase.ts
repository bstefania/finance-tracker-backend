import admin from 'firebase-admin';
import { getEnvironmentVariable } from "./utils/EnvironmentVariable"
import { Firestore } from 'firebase-admin/firestore';

export let db: Firestore

export const connectToFirebase = () => {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: getEnvironmentVariable("FIREBASE_PROJECT_ID"),
      privateKey: getEnvironmentVariable("FIREBASE_PRIVATE_KEY").replace(/\\n/g, '\n'),
      clientEmail: getEnvironmentVariable("FIREBASE_CLIENT_EMAIL")
    }),
    storageBucket: getEnvironmentVariable("FIREBASE_STORAGE_BUCKET")
  });
  
  db = admin.firestore()
}
