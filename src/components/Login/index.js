import React, { useReducer, useContext, useEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import StateContext, { STATES } from 'state/index'
import { JwtManager, ServiceManager } from 'services/index'
import { loginReducer, initialState, ACTIONS, LOGIN_STATES } from './loginState'
import styles from './styles.module.scss'

export default function Login() {
  const {
    state: { currentState, userLoggedIn },
    dispatch: dispatchToGlobalStateReducer,
  } = useContext(StateContext)
  const [loginState, dispatchToLoginReducer] = useReducer(loginReducer, initialState)
  const history = useHistory()

  const handleChange = useCallback(({ target }) => {
    dispatchToLoginReducer({ type: ACTIONS.updateField, field: target.id, value: target.value })
  }, [])

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      console.log(event.target)
      if (loginState.currentState !== LOGIN_STATES.fillForm) return

      dispatchToLoginReducer({ type: ACTIONS.stateTransition, nextState: LOGIN_STATES.validatingCredentials })
      JwtManager.requestJwt({
        // bodyParams: loginState.form,
        bodyParams: {
          username: 'jeff1967',
          password: 'hotdog',
        },
      })
        .then(() => {
          return ServiceManager.makeRequest({ method: 'get', endpoint: 'verifyToken' })
        })
        .then(async response => {
          console.log('SUCCESS', { response })
          dispatchToLoginReducer({ type: ACTIONS.stateTransition, nextState: LOGIN_STATES.authSuccess })
          dispatchToGlobalStateReducer({ type: 'logUser' })

          await new Promise(resolve => setTimeout(resolve, 1500))
          dispatchToGlobalStateReducer({ type: 'stateTransition' })
          history.push('/')
        })
        .catch(e => {
          dispatchToLoginReducer({ type: ACTIONS.apiError, error: e.response.data || e.message })
          dispatchToLoginReducer({ type: ACTIONS.stateTransition, nextState: LOGIN_STATES.fillForm })
        })
    },
    [dispatchToGlobalStateReducer, history, loginState.currentState],
  )

  console.log('Login 2', { userLoggedIn, globalState: currentState, loginState: loginState.currentState })

  return (
    <div className={`component-container ${styles.wrapper}`}>
      {!userLoggedIn ? (
        <form onSubmit={handleSubmit} onChange={handleChange}>
          <div className={styles.field}>
            <label htmlFor="username">
              <span className={styles['field-label']}>Username</span>
              <span className={styles['field-hint']}>The username you chose at signup.</span>
            </label>
            <input type="text" id="username" name="password" value={loginState.form.username} />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">
              <span className={styles['field-label']}>Password</span>
              <span className={styles['field-hint']}>Must contain ...</span>
            </label>
            <input type="password" id="password" name="password" value={loginState.form.password} />
          </div>
          <div className={styles.submit}>
            {loginState.error && (
              <label htmlFor="submit">
                <span className={styles['form-error']}>{loginState.error}</span>
              </label>
            )}
            <input
              type="submit"
              id="submit"
              value={loginState.currentState === LOGIN_STATES.validatingCredentials ? 'Validating....' : 'Log In'}
            />
          </div>
        </form>
      ) : (
        'SUCCESS VALIDATING YOUR CREDENTIALS'
      )}
    </div>
  )
}
