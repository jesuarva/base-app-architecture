import axios from 'axios'

export const JwtManager = JwtManagerController()
export const ServiceManager = ServiceManagerController()

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
      ServiceManager.updateAxiosInstance()
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
      const { method = 'post', endpoint = 'login', queryParams, bodyParams } = (requestConfig = config)
      return JwtAxiosInstance[method](`${endpoint}${getQueryParamsString(queryParams)}`, bodyParams)
        .then(({ data: { token } }) => {
          console.log('requestJWT', token)
          this.update({ token })
        })
        .catch(e => {
          handleApiError(e, { service: 'JWT-Manager', endpoint })
        })
    },
  }
}

function ServiceManagerController() {
  let host
  let kioskManagerAxiosInstance = null
  let recoveryAttempts = 2
  return {
    getAxiosInstance() {
      return kioskManagerAxiosInstance
    },
    creteAxiosInstance(uri) {
      host = uri
      kioskManagerAxiosInstance = axios.create({
        baseURL: host,
        timeout: 2000,
        headers: {
          Authorization: `${JwtManager.getTokenType()} ${JwtManager.getToken()}`,
        },
      })
    },
    updateAxiosInstance() {
      kioskManagerAxiosInstance = axios.create({
        baseURL: host,
        timeout: 2000,
        headers: {
          Authorization: `${JwtManager.getTokenType()} ${JwtManager.getToken()}`,
        },
      })
    },
    makeRequest(options) {
      const {
        // prettier-ignore
        method,
        endpoint,
        queryParams,
        bodyParams = {},
        cancelRecover = false,
        apiCallControl = 1,
        protectedEndpoint = true,
      } = options
      return (
        new Promise((resolve, reject) => {
          protectedEndpoint && JwtManager.hasValidToken() ? resolve() : reject()
        })
          .catch(() => JwtManager.waitForValidJwt())
          /* Make HTTP request */
          .then(() => kioskManagerAxiosInstance[method](`${endpoint}${getQueryParamsString(queryParams)}`, bodyParams))
          /* Handle HTTP response errors AND try-to-recover  */
          .catch(async e => {
            if (cancelRecover === true || apiCallControl > recoveryAttempts) {
              /* Stop re-trying to recover */
              handleApiError(e, { service: 'Service-Manager', endpoint, apiCallControl: apiCallControl - 1 })
            }
            /* Re-try to recover */
            await new Promise(resolve => setTimeout(() => resolve()), 100)
            return this.makeRequest({ ...options, apiCallControl: apiCallControl + 1 })
          })
      )
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

function handleApiError(error, { service, endpoint, apiCallControl = 1 }) {
  if (error.response || error.request) {
    error.message = `${service}: ${error.message}. Number of API calls: ${apiCallControl}`
  } else {
    error.message = `${service}: Unable to trigger request to ${endpoint}. Number of API calls: ${apiCallControl}. ${error.message} `
  }
  throw error
}
