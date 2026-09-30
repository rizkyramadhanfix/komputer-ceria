import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

// Initialize Firebase SDK
export const firebaseApp = initializeApp(firebaseConfigData);

// Initialize Firestore with specific database ID if specified in config
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(firebaseApp, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(firebaseApp);

export const auth = getAuth(firebaseApp);

// Test Firestore online connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    console.log('✅ Firestore online connection verified.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('⚠️ Firestore is offline. Local fallback will be used.');
    }
  }
}

testConnection();
