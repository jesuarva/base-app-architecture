import React from 'react'
import Login from '../Login'
import styles from './App.module.scss'

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <a href="#!">Nav link</a>
        <a href="#!">Nav link</a>
      </header>
      <main className={styles.main}>
        <Login />
      </main>
      <footer className={styles.footer}>
        <a href="#!">Legal</a>
        <a href="#!">Contact</a>
      </footer>
    </div>
  )
}

export default App
