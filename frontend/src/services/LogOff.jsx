import React, { useState } from 'react'
import { logout } from './login.jsx'

export default function LogOff() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const openConfirm = () => setShowConfirm(true)
  const closeConfirm = () => {
    setShowConfirm(false)
    setError(null)
  }
  const confirmLogOff = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await logout()
      window.location.href = '/'
    } catch (error) {
      console.error('Logout API failed:', error)
      setError('Nepavyko atsijungti. Bandykite dar kartą.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <button className="logout-button" onClick={openConfirm} disabled={isLoading}>
        {isLoading ? 'Jungiantis...' : 'Atsijungti'}
      </button>

      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <p className="modal-text">Ar tikrai norite išeiti?</p>
            {error && <p className="modal-error">{error}</p>}
            <div className="modal-buttons">
              <button 
                className="modal-button modal-button-confirm" 
                onClick={confirmLogOff}
                disabled={isLoading}
              >
                {isLoading ? 'Jungiantis...' : 'Atsijungti'}
              </button>
              <button 
                className="modal-button modal-button-cancel" 
                onClick={closeConfirm}
                disabled={isLoading}
              >
                Atsaukti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
