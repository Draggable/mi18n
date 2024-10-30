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

export async function fetchData(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const handler = url.endsWith('.lang') ? 'text' : 'json'
    const data = await response[handler]()
    return data
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error)
    throw error
  }
}
