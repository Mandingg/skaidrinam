import React from 'react'
import './App.css'
import LogOff from './services/LogOff.jsx'

export default function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Skaidrinam</h1>
      </header>
      <main className="app-main">
        <LogOff />
      </main>
    </div>
  )
}
