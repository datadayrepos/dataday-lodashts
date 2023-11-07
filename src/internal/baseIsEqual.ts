import isObjectLike from '../isObjectLike'
import baseIsEqualDeep from './baseIsEqualDeep'

/**
 * The base implementation of `isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {number} bitmask The bitmask flags.
 *  1 - Unordered comparison
 *  2 - Partial comparison
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(
  value: any,
  other: any,
  bitmask: number = 1,
  customizer?: Function,
  stack?: object,
): boolean {
  if (value === other)
    return true

  if (
    value == null
    || other == null
    || (!isObjectLike(value) && !isObjectLike(other))
  )
  // eslint-disable-next-line no-self-compare
    return value !== value && other !== other

  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack)
}

export default baseIsEqual
