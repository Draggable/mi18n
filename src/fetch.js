import https from 'https'
import http from 'http'

const defaultOptions = Object.freeze({ method: 'GET', body: '' })
/**
 * Fetches a resource from the network.
 *
 * @param {string} url - The URL to fetch.
 * @param {Object} [fetchOptions={}] - The options for the fetch request.
 * @param {Object} [fetchOptions.headers] - Headers to include in the request.
 * @param {string} [fetchOptions.method] - The HTTP method to use (e.g., 'GET', 'POST').
 * @param {string|Buffer} [fetchOptions.body] - The body of the request.
 * @return {Promise<Object>} A promise that resolves to the response object.
 * @return {boolean} return.ok - Indicates if the response status is in the range 200-299.
 * @return {number} return.status - The HTTP status code of the response.
 * @return {string} return.statusText - The HTTP status message of the response.
 * @return {Map<string, string>} return.headers - The headers of the response.
 * @return {Buffer} return.body - The body of the response as a Buffer.
 * @return {function(): Promise<Buffer>} return.arrayBuffer - A function that returns a promise resolving to the body as an ArrayBuffer.
 * @return {function(): Promise<Object>} return.json - A function that returns a promise resolving to the body parsed as JSON.
 */
export function fetch(url, fetchOptions = {}) {
  const options = { ...defaultOptions, ...fetchOptions }
  const handler = url.startsWith('https') ? https : http

  return new Promise((resolve, reject) => {
    const request = handler.request(url, options, response => {
      processResponse(response, resolve)
    })

    request.on('error', error => reject(new Error(error.message)))
    if (options?.body) request.write(options.body)
    request.end()
  })
}

const processResponse = (response, onEnd) => {
  const data = []
  response.on('data', chunk => data.push(chunk))
  response.on('end', () => {
    const bodyBuffer = Buffer.concat(data)
    const result = {
      ok: response.statusCode >= 200 && response.statusCode < 300,
      status: response.statusCode,
      statusText: response.statusMessage,
      headers: new Map(Object.entries(response.headers)),
      body: bodyBuffer,
      arrayBuffer: () => Promise.resolve(bodyBuffer),
      json: () => Promise.resolve(JSON.parse(bodyBuffer.toString())),
    }
    onEnd(result)
  })
}
