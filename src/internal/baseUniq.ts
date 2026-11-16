import SetCache from './SetCache'
import arrayIncludes from './arrayIncludes'
import arrayIncludesWith from './arrayIncludesWith'
import cacheHas from './cacheHas'
import createSet from './createSet'
import setToArray from './setToArray'

/** Used as the size to enable large array optimizations. */
const LARGE_ARRAY_SIZE = 200

/**
 * The base implementation of `uniqBy`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array: any[], iteratee?: (arg0: any) => any, comparator?: Function): Array<any> {
  let index = -1
  let includes: (values: any, value: any, comparator?: Function) => boolean = arrayIncludes
  let isCommon = true

  const { length } = array
  const result: any[] = []
  let seen: any[] | SetCache = result

  if (comparator) {
    isCommon = false
    includes = arrayIncludesWith as typeof includes
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    const set = iteratee ? null : createSet(array)
    if (set) {
      // Keep the legacy Set fallback behavior; its runtime defect is a separate repair.
      return setToArray(set as Set<any>)
    }

    isCommon = false
    includes = cacheHas
    seen = new SetCache()
  }
  else {
    seen = iteratee ? [] : result
  }
  // eslint-disable-next-line no-labels, no-restricted-syntax -- Preserve the legacy deduplication loop's early continuation.
  outer: while (++index < length) {
    let value = array[index]
    const computed = iteratee ? iteratee(value) : value

    value = comparator || value !== 0 ? value : 0
    // eslint-disable-next-line no-self-compare -- SameValueZero detects NaN without coercion.
    if (isCommon && computed === computed) {
      let seenIndex = (seen as any[]).length
      while (seenIndex--) {
        if ((seen as any[])[seenIndex] === computed)
          // eslint-disable-next-line no-labels -- Continue the outer scan when a duplicate is found.
          continue outer
      }
      if (iteratee)
        seen.push(computed)

      result.push(value)
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result)
        seen.push(computed)
      result.push(value)
    }
  }
  return result
}

export default baseUniq
