import admin from 'firebase-admin'
import { Firestore } from 'firebase-admin/firestore'
import serviceAccount from "../serviceAccountKey.json"
export let db: Firestore

export const connectToFirebase = () => {
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
  
  db = admin.firestore()
}
