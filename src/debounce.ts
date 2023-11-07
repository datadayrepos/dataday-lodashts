import isObject from './isObject'
import root from './internal/root'

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked, or until the next browser frame is drawn. The debounced function
 * comes with a `cancel` method to cancel delayed `func` invocations and a
 * `flush` method to immediately invoke them. Provide `options` to indicate
 * whether `func` should be invoked on the leading and/or trailing edge of the
 * `wait` timeout. The `func` is invoked with the last arguments provided to the
 * debounced function. Subsequent calls to the debounced function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * If `wait` is omitted in an environment with `requestAnimationFrame`, `func`
 * invocation will be deferred until the next frame is drawn (typically about
 * 16ms).
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait]
 *  The number of milliseconds to delay; if omitted, `requestAnimationFrame` is
 *  used (if available).
 * @param {object} [options] The options object.
 * @param {boolean} [options.leading]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', debounce(calculateLayout, 150))
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }))
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * const debounced = debounce(batchLog, 250, { 'maxWait': 1000 })
 * const source = new EventSource('/stream')
 * jQuery(source).on('message', debounced)
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel)
 *
 * // Check for pending invocations.
 * const status = debounced.pending() ? "Pending..." : "Ready"
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options?: { leading?: boolean; maxWait?: number; trailing?: boolean },
): (...funcArgs: Parameters<T>) => void {
  let lastArgs: Parameters<T> | null = null
  let lastThis: any
  let maxWait: number | undefined
  let result: any
  // Assume this is browser environment
  let timerId: number | null = null
  let lastCallTime: number | undefined

  let lastInvokeTime = 0
  let leading = false
  let maxing = false
  let trailing = true

  // Bypass `requestAnimationFrame` by explicitly setting `wait=0`.
  const useRAF = !wait && wait !== 0 && typeof window.requestAnimationFrame === 'function'

  if (typeof func !== 'function')
    throw new TypeError('Expected a function')

  // Coerce `wait` to a number, defaulting to 0 if it's falsy
  wait = +wait || 0

  if (typeof options === 'object' && options !== null) {
    leading = !!options.leading
    maxing = 'maxWait' in options
    maxWait = maxing ? Math.max(+(options.maxWait || 0), wait) : undefined
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }

  function invokeFunc(time: number) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = null
    lastInvokeTime = time
    result = func.apply(thisArg, args as any)
    return result
  }

  function startTimer(pendingFunc: () => void, wait: number) {
    if (useRAF) {
      window.cancelAnimationFrame(timerId!)
      return window.requestAnimationFrame(pendingFunc)
    }
    return window.setTimeout(pendingFunc, wait) as unknown as number
  }

  function cancelTimer(id: number) {
    if (useRAF)
      window.cancelAnimationFrame(id)
    else
      window.clearTimeout(id)
  }

  function leadingEdge(time: number) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time
    // Start the timer for the trailing edge.
    timerId = startTimer(timerExpired, wait)
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result
  }

  function remainingWait(time: number) {
    const timeSinceLastCall = lastCallTime !== undefined ? time - lastCallTime : wait
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall

    // Here, ensure maxWait is defined before trying to use it in arithmetic
    return maxing && maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting
  }

  function shouldInvoke(time: number) {
    const timeSinceLastCall = lastCallTime !== undefined ? time - lastCallTime : wait
    const timeSinceLastInvoke = time - lastInvokeTime

    // Here, check that maxWait is not undefined before comparing it
    return (
      lastCallTime === undefined
      || timeSinceLastCall >= wait
      || timeSinceLastCall < 0
      || (maxing && maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time))
      return trailingEdge(time)

    // Restart the timer.
    timerId = startTimer(timerExpired, remainingWait(time))
  }

  function trailingEdge(time: number) {
    timerId = null

    if (trailing && lastArgs)
      return invokeFunc(time)

    lastArgs = lastThis = null
    return result
  }

  function cancel() {
    if (timerId !== null)
      cancelTimer(timerId)

    lastInvokeTime = 0
    // Correctly assign undefined instead of null to match the type
    lastArgs = null
    lastCallTime = lastThis = undefined // if these should also be reset to null, adjust their types accordingly

    timerId = null
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now())
  }

  function pending() {
    return timerId !== undefined
  }

  function debounced(...args: Parameters<T>) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastCallTime = time

    if (isInvoking) {
      if (timerId === null)
        return leadingEdge(lastCallTime)

      if (maxing) {
        // Using an arrow function to maintain the correct `this` context
        timerId = startTimer(() => timerExpired(), wait)
        return invokeFunc(lastCallTime)
      }
    }

    if (timerId === null) {
      // Using an arrow function to maintain the correct `this` context
      timerId = startTimer(() => timerExpired(), wait)
    }
  }

  debounced.cancel = cancel
  debounced.flush = flush
  debounced.pending = pending
  return debounced
}

export default debounce
