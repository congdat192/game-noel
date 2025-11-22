import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './pages/Auth'
import Game from './pages/Game'
import Results from './pages/Results'
import Leaderboard from './pages/Leaderboard'
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [currentView, setCurrentView] = useState('menu') // menu, game, results, leaderboard
  const [lastScore, setLastScore] = useState(0)
  const [voucher, setVoucher] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleGameOver = (score) => {
    setLastScore(score)
    // Mock voucher logic
    if (score > 50) {
      setVoucher({
        code: 'XMAS2023-' + Math.floor(Math.random() * 10000),
        value: '50.000đ',
        daysValid: 7
      })
    } else {
      setVoucher(null)
    }
    setCurrentView('results')
  }

  const handlePlayAgain = () => {
    setCurrentView('game')
  }

  const handleShare = () => {
    alert('Share functionality implemented here!')
  }

  if (!session) {
    return <Auth />
  }

  return (
    <div className="app-container">
      {currentView === 'menu' && (
        <div className="menu">
          <h1>Catch & Win</h1>
          <p>Welcome!</p>
          <button onClick={() => setCurrentView('game')}>Play Game</button>
          <button className="secondary" onClick={() => setCurrentView('leaderboard')}>Leaderboard</button>
          <button className="outline" onClick={() => supabase.auth.signOut()}>Logout</button>
        </div>
      )}

      {currentView === 'game' && (
        <Game onGameOver={handleGameOver} />
      )}

      {currentView === 'results' && (
        <Results
          score={lastScore}
          voucher={voucher}
          onPlayAgain={handlePlayAgain}
          onShare={handleShare}
        />
      )}

      {currentView === 'leaderboard' && (
        <div style={{width: '100%', maxWidth: '400px'}}>
            <button
                onClick={() => setCurrentView('menu')}
                style={{
                    marginBottom: '10px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ddd',
                    cursor: 'pointer'
                }}
            >
                &larr; Back to Menu
            </button>
            <Leaderboard />
        </div>
      )}
    </div>
  )
}

export default App
