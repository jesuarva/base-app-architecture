import axios from 'axios'

export const JwtManager = JwtManagerController()

function JwtManagerController() {
  let JwtAxiosInstance = null
  let JWToken = ''
  let tokenType = 'Bearer'
  let requestConfig = {}
  let expiresInMilliseconds = process.env.AUTH_EXPIRY_TIME || 6 * 20
  let lastCallTimeInMilliseconds = 0
  return {
    getAxiosInstance() {
      return JwtAxiosInstance
    },
    getToken() {
      return JWToken
    },
    getTokenType() {
      return tokenType
    },
    creteAxiosInstance(host) {
      JwtAxiosInstance = axios.create({
        baseURL: host,
        timeout: 2000,
        headers: {
          'content-type': 'application/json',
        },
      })
    },
    update({ token, expires_in, token_type }) {
      JWToken = token
      tokenType = token_type || 'Bearer'
      expiresInMilliseconds = expires_in || expiresInMilliseconds
      lastCallTimeInMilliseconds = Date.now() - 30 // Consider a latency of 30ms
    },
    reset() {
      JWToken = ''
      tokenType = 'Bearer'
      requestConfig = {}
    },
    hasValidToken() {
      return Boolean(JWToken && Date.now() - lastCallTimeInMilliseconds < expiresInMilliseconds)
    },
    waitForValidJwt() {
      return this.requestJwt({ bodyParams: requestConfig.bodyParams })
    },
    requestJwt(config) {
      const { method = 'post', endpoint = 'login', queryParams = {}, bodyParams } = (requestConfig = config)
      return JwtAxiosInstance[method](`${endpoint}${getQueryParamsString(queryParams)}`, bodyParams)
        .then(({ data: { token } }) => {
          console.log('requestJWT', token)
          this.update({ token })
        })
        .catch(e => {
          handleApiError(e, { endpoint })
        })
    },
  }
}

function getQueryParamsString(queryParams) {
  return queryParams
    ? Object.entries(queryParams).reduce((queryString, [param, value]) => {
        if (!value) return queryString
        if (queryString) {
          // eslint-disable-next-line no-param-reassign
          queryString += `&${param}=${value}`
        } else {
          // eslint-disable-next-line no-param-reassign
          queryString += `?${param}=${value}`
        }
        return queryString
      }, '')
    : ''
}

function handleApiError(error, { endpoint, apiCallControl = 1 }) {
  if (error.response) {
    error.message = `Service-Manager: Unable to get a successful status from ${endpoint}, status: ${error.response.status}. Number of API calls: ${apiCallControl}`
  } else if (error.request) {
    error.message = `Service-Manager: Request send but no response was received from ${endpoint}. Number of API calls: ${apiCallControl}`
  } else {
    error.message = `Service-Manager: Unable to trigger request to ${endpoint}. Number of API calls: ${apiCallControl}. ${error.message} `
  }
  throw error
}
