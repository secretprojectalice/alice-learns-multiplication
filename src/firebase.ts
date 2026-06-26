import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAdC-iiY9wz9XnkeeYCsUmS9SP0PZlBPp0',
  authDomain: 'alice-learns-multiplication.firebaseapp.com',
  projectId: 'alice-learns-multiplication',
  storageBucket: 'alice-learns-multiplication.firebasestorage.app',
  messagingSenderId: '831684607464',
  appId: '1:831684607464:web:463af31d3c27d603d1785d',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

export async function ensureSignedIn(): Promise<void> {
  if (!auth.currentUser) {
    await signInAnonymously(auth)
  }
}
