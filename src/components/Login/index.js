import React, { useReducer, useContext, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import StateContext, { STATES } from 'state/index'
import { loginReducer, initialState, ACTIONS } from './loginState'
import styles from './styles.module.scss'

export default function Login() {
  const {
    state: { currentState },
    dispatch: dispatchToGlobalState,
  } = useContext(StateContext)
  const [state, dispatchToLogin] = useReducer(loginReducer, initialState)
  const history = useHistory()

  const handleChange = useCallback(({ target }) => {
    dispatchToLogin({ type: ACTIONS.updateField, field: target.id, value: target.value })
  }, [])
  const handleSubmit = useCallback(event => {
    event.preventDefault()
  }, [])

  useEffect(() => {
    setTimeout(dispatchToGlobalState, 2000, { type: 'logUser' })
  }, [dispatchToGlobalState])
  useEffect(() => {
    if (currentState === STATES.loggedIn) history.push('/')
  }, [currentState, history])

  console.log('Login 2', { state: currentState, form: state.form })

  return (
    <div className={`component-container ${styles.wrapper}`}>
      <form onSubmit={handleSubmit} onChange={handleChange}>
        <div className={styles.field}>
          <label htmlFor="username">
            <span className={styles['field-label']}>Username</span>
            <span className={styles['field-hint']}> The username you chose at signup. </span>
          </label>
          <input type="text" id="username" name="password" />{' '}
        </div>
        <div className={styles.field}>
          <label htmlFor="password">
            <span className={styles['field-label']}>Password</span>
            <span className={styles['field-hint']}>Must contain _detail_password_requirements_.</span>
          </label>
          <input type="password" id="password" name="password" />
        </div>
        <div className={styles.submit}>
          <input type="submit" id="submit" value="Log In" />
        </div>
      </form>
    </div>
  )
}
