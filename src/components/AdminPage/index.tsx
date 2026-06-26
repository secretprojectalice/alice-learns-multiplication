import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore'
import { db, ensureSignedIn } from '../../firebase'
import styles from './AdminPage.module.css'

type SessionDoc = {
  id: string
  date: string
  start: Timestamp
  end: Timestamp | null
}

type DaySummary = {
  date: string
  sessions: SessionDoc[]
  totalMs: number
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

function formatTime(ts: Timestamp): string {
  return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function AdminPage() {
  const [days, setDays] = useState<DaySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        await ensureSignedIn()
        const q = query(collection(db, 'sessions'), orderBy('start', 'desc'))
        const snapshot = await getDocs(q)

        const docs: SessionDoc[] = snapshot.docs.map(d => ({
          id: d.id,
          ...(d.data() as Omit<SessionDoc, 'id'>),
        }))

        const byDate = new Map<string, SessionDoc[]>()
        for (const s of docs) {
          const arr = byDate.get(s.date) ?? []
          arr.push(s)
          byDate.set(s.date, arr)
        }

        const summaries: DaySummary[] = []
        for (const [date, sessions] of byDate) {
          const totalMs = sessions.reduce((sum, s) => {
            if (!s.end) return sum
            return sum + (s.end.toMillis() - s.start.toMillis())
          }, 0)
          summaries.push({ date, sessions, totalMs })
        }

        summaries.sort((a, b) => b.date.localeCompare(a.date))
        setDays(summaries)
      } catch (e) {
        setError(String(e))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className={styles.state}>Loading…</div>
  if (error) return <div className={`${styles.state} ${styles.error}`}>{error}</div>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Session Log</h1>
      {days.length === 0 && <p className={styles.empty}>No sessions recorded yet.</p>}
      {days.map(day => (
        <section key={day.date} className={styles.day}>
          <div className={styles.dayHeader}>
            <span className={styles.dayDate}>{day.date}</span>
            <span className={styles.dayTotal}>{formatDuration(day.totalMs)}</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {day.sessions.map(s => (
                <tr key={s.id} className={!s.end ? styles.incomplete : ''}>
                  <td>{formatTime(s.start)}</td>
                  <td>{s.end ? formatTime(s.end) : '—'}</td>
                  <td>
                    {s.end
                      ? formatDuration(s.end.toMillis() - s.start.toMillis())
                      : 'incomplete'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
