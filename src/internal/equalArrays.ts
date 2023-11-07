import some from '../some'
import SetCache from './SetCache'
import cacheHas from './cacheHas'

// import type Stack from './Stack'

/** Used to compose bitmasks for value comparisons. */
const COMPARE_PARTIAL_FLAG = 1
const COMPARE_UNORDERED_FLAG = 2

interface Stack {
  get(key: any[]): any // Accept an array of any type as the key
  set(key: any[], value: any): void // Accept an array of any type as the key
  delete(key: any[]): void // Accept an array of any type as the key
  // ... other methods and properties ...
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(
  array: any[],
  other: any[],
  bitmask: number = 1,
  customizer?: (arg0: any, arg1: any, arg2: number, arg3: any, arg4: any, arg5: any) => any,
  equalFunc?: (arg0: any, arg1: any, bitmask: number, customizer?: Function, stack?: Stack) => boolean,
  stack?: Stack,
): boolean {
  if (!stack)
    throw new Error('A stack must be provided')

  const isPartial = bitmask & COMPARE_PARTIAL_FLAG
  const arrLength = array.length
  const othLength = other.length

  if (arrLength !== othLength && !(isPartial && othLength > arrLength))
    return false

  // Assume cyclic values are equal.
  const stacked = stack?.get(array)
  if (stacked && stack?.get(other))
    return stacked === other

  let index = -1
  let result = true
  const seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined

  stack?.set(array, other)
  stack?.set(other, array)

  // Ignore non-index properties.
  while (++index < arrLength) {
    let compared
    const arrValue = array[index]
    const othValue = other[index]

    if (customizer) {
      compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack)
    }
    if (compared !== undefined) {
      if (compared)
        continue

      result = false
      break
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (
        !some(other, (othValue, othIndex) => {
          if (
            !cacheHas(seen, othIndex.toString())
             && (arrValue === othValue || (equalFunc && equalFunc(arrValue, othValue, bitmask, customizer, stack)))
          )
            seen.push(othIndex)
          return true // Explicitly return true when the conditions are met
        })
      )
        return false // Explicitly return false otherwise
    }
    else {
      if (
        !(
          arrValue === othValue
          || (equalFunc && equalFunc(arrValue, othValue, bitmask, customizer, stack))
        )
      ) {
        result = false
        break
      }
    }
    stack?.delete(array)
    stack?.delete(other)
  }
  return result
}

export default equalArrays
