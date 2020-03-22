import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import StateContext, { STATES } from 'state/index'
import { Button } from 'reakit/Button'
import styles from './styles.module.scss'

function Header(props) {
  const {
    state: { currentState },
    dispatch,
  } = useContext(StateContext)
  return (
    <header className={styles.header}>
      <Link className={styles.link} to="/">
        Home
      </Link>
      {currentState === STATES.loggedIn && (
        <Button className={styles['logout-button']} onClick={() => dispatch({ type: 'logoutUser' })}>
          Logout
        </Button>
      )}
    </header>
  )
}

export default Header
