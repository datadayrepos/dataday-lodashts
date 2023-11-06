import some from '../some'
import SetCache from './SetCache'
import cacheHas from './cacheHas'

/** Used to compose bitmasks for value comparisons. */
const COMPARE_PARTIAL_FLAG = 1
const COMPARE_UNORDERED_FLAG = 2

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
function equalArrays(array: string | any[], other: string | any[] | null, bitmask: number, customizer: (arg0: any, arg1: any, arg2: number, arg3: any, arg4: any, arg5: any) => any, equalFunc: (arg0: any, arg1: any, arg2: any, arg3: any, arg4: any) => any, stack: { get: (arg0: any) => any; set: (arg0: any, arg1: any) => void; delete: (arg0: any) => void }) {
  const isPartial = bitmask & COMPARE_PARTIAL_FLAG
  const arrLength = array.length
  const othLength = other.length

  if (arrLength != othLength && !(isPartial && othLength > arrLength))
    return false

  // Assume cyclic values are equal.
  const stacked = stack.get(array)
  if (stacked && stack.get(other))
    return stacked === other

  let index = -1
  let result = true
  // @ts-expect-error
  const seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined

  stack.set(array, other)
  stack.set(other, array)

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
            !cacheHas(seen, othIndex)
            && (arrValue === othValue
              || equalFunc(arrValue, othValue, bitmask, customizer, stack))
          ) {
            // @ts-expect-error
            return seen.push(othIndex)
          }
        })
      ) {
        result = false
        break
      }
    }
    else if (
      !(
        arrValue === othValue
        || equalFunc(arrValue, othValue, bitmask, customizer, stack)
      )
    ) {
      result = false
      break
    }
  }
  stack.delete(array)
  stack.delete(other)
  return result
}

export default equalArrays
