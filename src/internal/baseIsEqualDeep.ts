import isBuffer from '../isBuffer'
import isTypedArray from '../isTypedArray'
import Stack from './Stack'
import equalArrays from './equalArrays'
import equalByTag from './equalByTag'
import equalObjects from './equalObjects'
import getTag from './getTag'

/** Used to compose bitmasks for value comparisons. */
const COMPARE_PARTIAL_FLAG = 1

/** `Object#toString` result references. */
const argsTag = '[object Arguments]'
const arrayTag = '[object Array]'
const objectTag = '[object Object]'

/** Used to check objects for own properties. */
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {object} object The object to compare.
 * @param {object} other The other object to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(
  object: Record<PropertyKey, any>,
  other: Record<PropertyKey, any>,
  bitmask: number = 1,
  customizer?: (...args: any[]) => any,
  equalFunc?: (...args: any[]) => boolean,
  stack?: Stack,
): boolean {
  let objIsArr = Array.isArray(object)
  const othIsArr = Array.isArray(other)
  let objTag = objIsArr ? arrayTag : getTag(object)
  let othTag = othIsArr ? arrayTag : getTag(other)

  objTag = objTag === argsTag ? objectTag : objTag
  othTag = othTag === argsTag ? objectTag : othTag

  let objIsObj = objTag === objectTag
  const othIsObj = othTag === objectTag
  const isSameTag = objTag === othTag

  if (isSameTag && isBuffer(object)) {
    if (!isBuffer(other))
      return false

    objIsArr = true
    objIsObj = false
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack([]))
    return objIsArr || isTypedArray(object)
      ? equalArrays(object as any[], other as any[], bitmask, customizer, equalFunc, stack)
      : equalByTag(
        object,
        other,
        objTag,
        bitmask,
        customizer,
        equalFunc,
        stack,
      )
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
    const objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__')
    const othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__')

    if (objIsWrapped || othIsWrapped) {
      const objUnwrapped = objIsWrapped ? object.value() : object
      const othUnwrapped = othIsWrapped ? other.value() : other
      stack || (stack = new Stack([]))
      return equalFunc!(objUnwrapped, othUnwrapped, bitmask, customizer, stack)
    }
  }
  if (!isSameTag)
    return false

  stack || (stack = new Stack([]))
  return equalObjects(object, other, bitmask, customizer, equalFunc, stack)
}

export default baseIsEqualDeep
