/**
 * Shim for @aptos-labs/aptos-client that provides the browser implementation.
 * This replaces the Node.js build (which uses `got`) with the browser build (which uses `fetch`).
 *
 * Based on: https://github.com/aptos-labs/aptos-client/blob/main/src/index.browser.ts
 *
 * This allows the Aptos SDK to work in bare runtime without Node.js-specific dependencies.
 */

/**
 * Builds the request URL and config from options.
 * @param {Object} options - The request options
 * @returns {{ requestUrl: string, requestConfig: RequestInit }}
 */
function buildRequest (options) {
  const headers = new Headers()
  Object.entries(options.headers ?? {}).forEach(([key, value]) => {
    headers.append(key, String(value))
  })

  const body = options.body instanceof Uint8Array
    ? options.body
    : JSON.stringify(options.body)

  const withCredentialsOption = options.overrides?.WITH_CREDENTIALS
  let credentials
  if (withCredentialsOption === false) {
    credentials = 'omit'
  } else if (withCredentialsOption === true) {
    credentials = 'include'
  } else {
    credentials = withCredentialsOption ?? 'include'
  }

  const requestConfig = {
    method: options.method,
    headers,
    body,
    credentials
  }

  const params = new URLSearchParams()
  Object.entries(options.params ?? {}).forEach(([key, value]) => {
    if (value !== undefined) {
      params.append(key, String(value))
    }
  })

  const paramsString = params.toString()
  const requestUrl = options.url + (paramsString ? `?${paramsString}` : '')

  return { requestUrl, requestConfig }
}

/**
 * Default client for JSON responses.
 * @param {Object} options - The request options
 * @returns {Promise<Object>} The response
 */
async function aptosClient (options) {
  return jsonRequest(options)
}

/**
 * Client for JSON responses.
 * @param {Object} options - The request options
 * @returns {Promise<Object>} The response
 */
async function jsonRequest (options) {
  const { requestUrl, requestConfig } = buildRequest(options)

  const res = await fetch(requestUrl, requestConfig)
  const data = await res.json()

  return {
    status: res.status,
    statusText: res.statusText,
    data,
    headers: res.headers,
    config: requestConfig
  }
}

/**
 * Client for BCS (binary) responses.
 * @param {Object} options - The request options
 * @returns {Promise<Object>} The response with ArrayBuffer data
 */
async function bcsRequest (options) {
  const { requestUrl, requestConfig } = buildRequest(options)

  const res = await fetch(requestUrl, requestConfig)
  const data = await res.arrayBuffer()

  return {
    status: res.status,
    statusText: res.statusText,
    data,
    headers: res.headers,
    config: requestConfig
  }
}

// Default export
export default aptosClient

// Named exports
export { aptosClient, jsonRequest, bcsRequest }
