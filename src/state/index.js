import { createContext } from 'react'
import produce from 'immer'

export default createContext()

export const STATES = {
  loggedOut: 'LOGGED_OUT',
  loggedIn: 'LOGGED_IN',
}

export const initialState = {
  previousState: '',
  currentState: STATES.loggedOut,
  userLoggedIn: false,
}

export function reducer(state = initialState, action) {
  switch (state.currentState) {
    case STATES.loggedOut: {
      return loggedOutReducer(state, action)
    }
    case STATES.loggedIn: {
      return loggedInReducer(state, action)
    }
    default:
      return state
  }
}

function loggedOutReducer(state, action) {
  switch (action.type) {
    case 'logUser':
      return produce(state, draftState => {
        draftState.userLoggedIn = true
      })
    case 'stateTransition':
      return produce(state, draftState => {
        draftState.currentState = STATES.loggedIn
      })
    default:
      return state
  }
}

function loggedInReducer(state, action) {
  switch (action.type) {
    case 'logoutUser':
      return produce(state, draftState => {
        draftState.currentState = STATES.loggedOut
        draftState.userLoggedIn = false
      })
    default:
      return state
  }
}
