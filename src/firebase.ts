import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccountKey from "./serviceAccountKey.json";

const serviceAccount = serviceAccountKey as admin.ServiceAccount;

const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

export const db = getFirestore(app);