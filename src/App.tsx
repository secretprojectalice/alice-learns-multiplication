import { useState } from 'react'
import { Factor, AppView } from './types'
import { MainPage } from './components/MainPage'
import { PracticeSetup } from './components/PracticeSetup'
import { FlashcardSession } from './components/FlashcardSession'
import { AdminPage } from './components/AdminPage'
import { useSessionTracking } from './hooks/useSessionTracking'

function LearningApp() {
  useSessionTracking()
  const [view, setView] = useState<AppView>('main')
  const [sessionFactors, setSessionFactors] = useState<Factor[]>([])

  function handleStartSession(factors: Factor[]) {
    setSessionFactors(factors)
    setView('session')
  }

  if (view === 'session') {
    return (
      <FlashcardSession
        factors={sessionFactors}
        operandMin={1}
        operandMax={10}
        onDone={() => setView('main')}
      />
    )
  }

  if (view === 'setup') {
    return (
      <PracticeSetup
        onStart={handleStartSession}
        onBack={() => setView('main')}
      />
    )
  }

  return <MainPage onPractice={() => setView('setup')} />
}

export default function App() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const isAdmin = segments[segments.length - 1] === 'admin'
  return isAdmin ? <AdminPage /> : <LearningApp />
}
