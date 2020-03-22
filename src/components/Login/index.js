import React, { Fragment, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import StateContext, { STATES } from 'state/index'
import styles from './styles.module.scss'

export default function Login() {
  const {
    state: { currentState },
    dispatch,
  } = useContext(StateContext)
  const history = useHistory()
  useEffect(() => {
    setTimeout(dispatch, 2000, { type: 'logUser' })
  }, [dispatch])
  useEffect(() => {
    if (currentState === STATES.loggedIn) history.push('/')
  }, [currentState, history])
  console.log('Login 2', { state: currentState })

  return <Fragment>{`State: ${currentState}`}</Fragment>
}
