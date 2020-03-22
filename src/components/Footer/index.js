import React from 'react'
import { Link } from 'react-router-dom'
import styles from './styles.module.scss'

function Footer(props) {
  return (
    <footer className={styles.footer}>
      <Link className={styles.link} to="legal">
        Legal
      </Link>
      <Link className={styles.link} to="contact">
        Contact
      </Link>
    </footer>
  )
}

export default Footer
