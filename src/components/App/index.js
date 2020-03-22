import React, { useReducer } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Context, { reducer, initialState, STATES } from 'state/index'
import Login from 'components/Login'
import Header from 'components/Header'
import Footer from 'components/Footer'
import Page404 from 'components/Page404'
import styles from './styles.module.scss'
import Main from 'components/Main'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  console.log('App', { state: state.currentState })
  return (
    <Context.Provider value={{ state, dispatch }}>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <Switch>
            <Route exact path="/">
              {state.currentState === STATES.loggedIn ? <Main /> : <Redirect to="/login" />}
            </Route>
            <Route path="/login" component={Login} />
            <Route component={Page404} />
          </Switch>
        </main>
        <Footer />
      </div>
    </Context.Provider>
  )
}
