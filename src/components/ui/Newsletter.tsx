'use client'

import { useState } from 'react'
import styles from './Newsletter.module.css'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')

    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setMessage('Thank you for subscribing!')
      setEmail('')

      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    }, 1000)
  }

  return (
    <div className={styles.newsletter}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h2>Stay in the Loop</h2>
          <p>Get exclusive access to new arrivals, sales, and special offers</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {message && (
            <p className={`${styles.message} ${styles[status]}`}>
              {message}
            </p>
          )}
        </form>

        <p className={styles.privacy}>
          By subscribing, you agree to our Privacy Policy and consent to receive updates
        </p>
      </div>
    </div>
  )
}
