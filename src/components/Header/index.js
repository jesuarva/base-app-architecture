import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.scss'

function Header(props) {
  return (
    <header className={styles.header}>
      <Link className={styles.link} to="home">
        Home
      </Link>
      <Link className={styles.link} to="login">
        Login
      </Link>
    </header>
  )
}

export default Header
