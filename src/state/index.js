import { createContext } from 'react'
import produce from 'immer'

export const initialState = {
  previousState: '',
  currentState: 'loggedOut',
  auth: {
    user: '',
    password: '',
  },
}

export function reducer(state = initialState, action) {
  switch (state.currentState) {
    case 'loggedOut': {
      return produce(state, draftState => {})
    }
    case 'loggedIn': {
      return produce(state, draftState => {})
    }
    default:
      return state
  }
}

export default createContext()
