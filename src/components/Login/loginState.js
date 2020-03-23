import produce from 'immer'

export const LOGIN_STATES = {
  fillForm: 'FILL_FORM',
  validatingCredentials: 'VALIDATING',
  authSuccess: 'AUTH_SUCCESS',
}

export const ACTIONS = {
  updateField: 'UPDATE_FIELD',
  stateTransition: 'STATA_TRANSITION',
  reset: 'RESET',
  apiError: 'API_ERROR',
}

export const initialState = {
  currentState: LOGIN_STATES.fillForm,
  form: {
    username: '',
    password: '',
  },
  error: '',
}

export function loginReducer(state, action) {
  switch (state.currentState) {
    case LOGIN_STATES.fillForm:
      return fillFormReducer(state, action)
    case LOGIN_STATES.validatingCredentials:
      return validateCredentialsReducer(state, action)
    case LOGIN_STATES.authSuccess:
      return authSuccessReducer(state, action)
    default:
      return state
  }
}

function fillFormReducer(state, action) {
  switch (action.type) {
    case ACTIONS.stateTransition:
      return LOGIN_STATES.validatingCredentials === action.nextState
        ? produce(state, draftState => {
            draftState.currentState = action.nextState
          })
        : state
    case ACTIONS.updateField:
      return produce(state, draftState => {
        draftState.form[action.field] = action.value
        draftState.error = ''
      })
    case ACTIONS.reset:
      return produce(state, draftState => {
        draftState.form = {
          username: '',
          password: '',
        }
      })
    default:
      return state
  }
}

function validateCredentialsReducer(state, action) {
  switch (action.type) {
    case ACTIONS.stateTransition:
      return produce(state, draftState => {
        draftState.currentState = action.nextState
      })
    case ACTIONS.apiError:
      return produce(state, draftState => {
        draftState.error = action.error
      })
    default:
      return state
  }
}

function authSuccessReducer(state, action) {
  switch (action.type) {
    case '':
      return produce(state, draftState => {})
    default:
      return state
  }
}
