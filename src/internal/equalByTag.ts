import eq from '../eq'
import equalArrays from './equalArrays'
import mapToArray from './mapToArray'
import setToArray from './setToArray'
import type Stack from './Stack'

/** Used to compose bitmasks for value comparisons. */
const COMPARE_PARTIAL_FLAG = 1
const COMPARE_UNORDERED_FLAG = 2

/** `Object#toString` result references. */
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const mapTag = '[object Map]'
const numberTag = '[object Number]'
const regexpTag = '[object RegExp]'
const setTag = '[object Set]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'

const arrayBufferTag = '[object ArrayBuffer]'
const dataViewTag = '[object DataView]'

/** Used to convert symbols to primitives and strings. */
const symbolValueOf = Symbol.prototype.valueOf

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {object} object The object to compare.
 * @param {object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
 * @param {Function} customizer The function to customize comparisons.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Stack} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(
  object: any, // Changed to `any` to avoid property access errors
  other: any, // Changed to `any` for the same reason
  tag: string,
  bitmask: number = 1,
  customizer?: Function,
  equalFunc?: Function,
  stack?: Stack,
): boolean {
  let convert // Declare convert outside of the switch to avoid no-case-declarations warning

  switch (tag) {
    case dataViewTag:
      if (
        (object as DataView).byteLength !== (other as DataView).byteLength
        || (object as DataView).byteOffset !== (other as DataView).byteOffset
      )
        return false

      object = (object as DataView).buffer
      other = (other as DataView).buffer

      // Intentional fall through to the arrayBufferTag case
      /* falls through */

    case arrayBufferTag:
      if (
        (object as ArrayBuffer).byteLength !== (other as ArrayBuffer).byteLength
        || (equalFunc && !equalFunc(new Uint8Array(object as ArrayBuffer), new Uint8Array(other as ArrayBuffer)))
      )
        return false

      return true

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other)

    case errorTag:
      return object.name === other.name && object.message === other.message

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object === `${other}`

    case mapTag:
      convert = mapToArray
      // Intentional fall through to the setTag case
      /* falls through */

    case setTag: {
      const isPartial = bitmask & COMPARE_PARTIAL_FLAG
      convert || (convert = setToArray)

      if (object.size !== other.size && !isPartial)
        return false

      // Check if stack is defined before using it
      if (stack) {
        // Assume cyclic values are equal.
        const stacked = stack.get(object)
        if (stacked)
          return stacked === other

        bitmask |= COMPARE_UNORDERED_FLAG

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other)
        const result = equalArrays(
          convert(object),
          convert(other),
          bitmask,
          customizer,
          equalFunc,
          stack,
        )
        stack.delete(object)
        return result
      }
      else {
      // Handle the case where stack is undefined
        return false // or throw new Error('stack is required but was not provided');
      }
    }
    case symbolTag:
      if (symbolValueOf)
        return symbolValueOf.call(object) === symbolValueOf.call(other)
  }
  return false
}

export default equalByTag
