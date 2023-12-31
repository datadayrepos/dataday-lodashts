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
function baseUniq(array: any[], iteratee?: ((arg0: any) => any) | undefined, comparator?: undefined): Array<any> {
  let index = -1
  let includes = arrayIncludes
  let isCommon = true

  const { length } = array
  const result: any[] = []
  let seen = result

  if (comparator) {
    isCommon = false
    // @ts-expect-error
    includes = arrayIncludesWith
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    const set = iteratee ? null : createSet(array)
    if (set)
      return setToArray(set)

    isCommon = false
    includes = cacheHas
    // @ts-expect-error
    seen = new SetCache()
  }
  else {
    seen = iteratee ? [] : result
  }
  outer: while (++index < length) {
    let value = array[index]
    const computed = iteratee ? iteratee(value) : value

    value = comparator || value !== 0 ? value : 0
    if (isCommon && computed === computed) {
      let seenIndex = seen.length
      while (seenIndex--) {
        if (seen[seenIndex] === computed)
          continue outer
      }
      if (iteratee)
        seen.push(computed)

      // @ts-expect-error
      result.push(value)
      // @ts-expect-error
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        // @ts-expect-error
        seen.push(computed)
      }
      // @ts-expect-error
      result.push(value)
    }
  }
  return result
}

export default baseUniq
