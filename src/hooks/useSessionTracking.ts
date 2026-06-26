import { useEffect, useRef } from 'react'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { auth, db, ensureSignedIn } from '../firebase'

function todayISO(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function useSessionTracking(): void {
  const sessionIdRef = useRef<string | null>(null)
  const startingRef = useRef(false)

  useEffect(() => {
    async function startSession() {
      if (startingRef.current || sessionIdRef.current) return
      startingRef.current = true
      try {
        await ensureSignedIn()
        const docRef = await addDoc(collection(db, 'sessions'), {
          uid: auth.currentUser!.uid,
          date: todayISO(),
          start: serverTimestamp(),
          end: null,
        })
        sessionIdRef.current = docRef.id
      } catch (e) {
        console.error('[session] failed to start session:', e)
      } finally {
        startingRef.current = false
      }
    }

    async function endSession() {
      const id = sessionIdRef.current
      if (!id) return
      sessionIdRef.current = null
      try {
        await updateDoc(doc(db, 'sessions', id), {
          end: serverTimestamp(),
        })
      } catch (e) {
        console.error('[session] failed to end session:', e)
        sessionIdRef.current = id // restore so a retry is possible
      }
    }

    startSession()

    function handleVisibilityChange() {
      if (document.visibilityState === 'hidden') {
        endSession()
      } else {
        startSession()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])
}
