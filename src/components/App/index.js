import React, { useReducer } from 'react'
import Context, { reducer, initialState } from '../../state'
import Login from '../Login'
import styles from './App.module.scss'

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <Context.Provider value={{ state, dispatch }}>
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
    </Context.Provider>
  )
}

export default App
