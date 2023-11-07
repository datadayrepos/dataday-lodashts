import isBuffer from '../isBuffer'
import isObject from '../isObject'
import isTypedArray from '../isTypedArray'
import keys from '../keys'
import keysIn from '../keysIn'
import Stack from './Stack'
import arrayEach from './arrayEach'
import assignValue from './assignValue'
import cloneBuffer from './cloneBuffer'
import copyArray from './copyArray'
import copyObject from './copyObject'
import cloneArrayBuffer from './cloneArrayBuffer'
import cloneDataView from './cloneDataView'
import cloneRegExp from './cloneRegExp'
import cloneSymbol from './cloneSymbol'
import cloneTypedArray from './cloneTypedArray'
import copySymbols from './copySymbols'
import copySymbolsIn from './copySymbolsIn'
import getAllKeys from './getAllKeys'
import getAllKeysIn from './getAllKeysIn'
import getTag from './getTag'
import initCloneObject from './initCloneObject'

import type { CloneableTypedArray } from './cloneTypedArray'

/** Used to compose bitmasks for cloning. */
const CLONE_DEEP_FLAG = 1
const CLONE_FLAT_FLAG = 2
const CLONE_SYMBOLS_FLAG = 4

/** `Object#toString` result references. */
const argsTag = '[object Arguments]'
const arrayTag = '[object Array]'
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const mapTag = '[object Map]'
const numberTag = '[object Number]'
const objectTag = '[object Object]'
const regexpTag = '[object RegExp]'
const setTag = '[object Set]'
const stringTag = '[object String]'
const symbolTag = '[object Symbol]'
const weakMapTag = '[object WeakMap]'

const arrayBufferTag = '[object ArrayBuffer]'
const dataViewTag = '[object DataView]'
const float32Tag = '[object Float32Array]'
const float64Tag = '[object Float64Array]'
const int8Tag = '[object Int8Array]'
const int16Tag = '[object Int16Array]'
const int32Tag = '[object Int32Array]'
const uint8Tag = '[object Uint8Array]'
const uint8ClampedTag = '[object Uint8ClampedArray]'
const uint16Tag = '[object Uint16Array]'
const uint32Tag = '[object Uint32Array]'

/** Used to identify `toStringTag` values supported by `clone`. */
const cloneableTags: { [key: string]: boolean } = {}
cloneableTags[argsTag]
  = cloneableTags[arrayTag]
  = cloneableTags[arrayBufferTag]
  = cloneableTags[dataViewTag]
  = cloneableTags[boolTag]
  = cloneableTags[dateTag]
  = cloneableTags[float32Tag]
  = cloneableTags[float64Tag]
  = cloneableTags[int8Tag]
  = cloneableTags[int16Tag]
  = cloneableTags[int32Tag]
  = cloneableTags[mapTag]
  = cloneableTags[numberTag]
  = cloneableTags[objectTag]
  = cloneableTags[regexpTag]
  = cloneableTags[setTag]
  = cloneableTags[stringTag]
  = cloneableTags[symbolTag]
  = cloneableTags[uint8Tag]
  = cloneableTags[uint8ClampedTag]
  = cloneableTags[uint16Tag]
  = cloneableTags[uint32Tag]
    = true
cloneableTags[errorTag] = cloneableTags[weakMapTag] = false

// Define a type that represents all the different types that can be cloned.
type Cloneable = ArrayBuffer | boolean | Date | DataView | Float32Array | Float64Array |
Int8Array | Int16Array | Int32Array | Uint8Array | Uint8ClampedArray |
Uint16Array | Uint32Array | Map<any, any> | number | RegExp | Set<any> | string | symbol

function isCloneableTypedArray(object: any): object is CloneableTypedArray {
  return ArrayBuffer.isView(object) && !(object instanceof DataView)
}

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {object} Returns the initialized clone.
 */
function initCloneByTag(object: object, tag: string, isDeep: boolean): Cloneable {
  const Ctor = object.constructor
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object as ArrayBuffer)

    case boolTag:
      // Return the primitive boolean value instead of a Boolean object
      return Boolean(object)
    case dateTag:
      // Return a new Date object
      return new Date(+object)

    case dataViewTag:
      return cloneDataView(object as DataView, isDeep)

    case float32Tag:
    case float64Tag:
    case int8Tag:
    case int16Tag:
    case int32Tag:
    case uint8Tag:
    case uint8ClampedTag:
    case uint16Tag:
    case uint32Tag:
      if (isCloneableTypedArray(object))
        return cloneTypedArray(object, isDeep)

      throw new Error('Object is not a CloneableTypedArray.')

    case mapTag:
      if (typeof object === 'object' && object instanceof Map)
        return new (object.constructor as MapConstructor)()
      throw new Error('Object is not a Map.')

    case numberTag:
      // Return the primitive number value instead of a Number object
      return Number(object)
    case stringTag:
      // Return the primitive string value instead of a String object
      return String(object)

    case regexpTag:
      if (object instanceof RegExp)
        return cloneRegExp(object as RegExp)

      throw new Error('Object is not a RegExp.')

    case setTag:
      // Assuming Set constructor here
      return new (Ctor as SetConstructor)()

    case symbolTag:
      return cloneSymbol(object as unknown as symbol)

    default:
      throw new Error('Unknown or unsupported tag.')
  }
}

interface RegExpExecArray extends Array<string> {
  index?: number
  input?: string
}

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array: any[]): any[] {
  const { length } = array
  // We are creating a new array with the same length as the original.
  const result = Array.from({ length }) as RegExpExecArray

  // Check if the array has properties `index` and `input` as it would if
  // it were a result from `RegExp#exec`. We use a type assertion here.
  if (length && typeof array[0] === 'string') {
    const matchArray = array as Array<string> & { index?: number; input?: string }
    if (matchArray.index != null)
      result.index = matchArray.index

    if (matchArray.input != null)
      result.input = matchArray.input
  }
  return result
}

/**
 * The base implementation of `clone` and `cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {number} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {object} [object] The parent object of `value`.
 * @param {object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(
  value: any,
  bitmask: number,
  customizer?: Function,
  key?: string | number | symbol, // Allowing key to be number or symbol
  object?: object,
  stack?: Stack, // Here we use `Stack` instead of `object`
): any {
  let result: any
  const isDeep = bitmask & CLONE_DEEP_FLAG
  const isFlat = bitmask & CLONE_FLAT_FLAG
  const isFull = bitmask & CLONE_SYMBOLS_FLAG

  if (customizer)
    result = object ? customizer(value, key, object, stack) : customizer(value)

  if (result !== undefined)
    return result

  if (!isObject(value))
    return value

  const isArr = Array.isArray(value)
  const tag = getTag(value)
  if (isArr) {
    result = initCloneArray(value)
    if (!isDeep)
      return copyArray(value, result as any[])
  }
  else {
    const isFunc = typeof value === 'function'

    if (isBuffer(value))
      return cloneBuffer(value, !!isDeep) // The double-bang ( !! ) will convert the number to a boolean

    if (tag === objectTag || tag === argsTag || (isFunc && !object)) {
      result = isFlat || isFunc ? {} : initCloneObject(value)
      if (!isDeep) {
        return isFlat
          ? copySymbolsIn(value, copyObject(value, keysIn(value), result))
          : copySymbols(value, Object.assign(result, value))
      }
    }
    else {
      if (isFunc || !cloneableTags[tag])
        return object ? value : {}

      result = initCloneByTag(value, tag, !!isDeep)
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack([]))
  const stacked = stack.get(value)
  if (stacked)
    return stacked

  stack.set(value, result)

  if (tag === mapTag) {
    value.forEach((subValue: any, key: string | undefined) => {
      result.set(
        key,
        baseClone(subValue, bitmask, customizer, key, value, stack),
      )
    })
    return result
  }

  if (tag === setTag) {
    value.forEach((subValue: string | undefined) => {
      result.add(
        baseClone(subValue, bitmask, customizer, subValue, value, stack),
      )
    })
    return result
  }

  if (isTypedArray(value))
    return result

  const keysFunc = isFull
    ? isFlat
      ? getAllKeysIn
      : getAllKeys
    : isFlat
      ? keysIn
      : keys

  const props = isArr ? undefined : keysFunc(value)

  arrayEach(props || value, (subValue: any, key: string | number | symbol | undefined) => {
    if (props)
      key = subValue as string | number | symbol // Assuming subValue is the key here

    if (typeof key !== 'undefined') {
      // Only access value[key] if key is not undefined
      subValue = value[key]
      // Recursively populate clone (susceptible to call stack limits).
      assignValue(
        result,
        key,
        baseClone(subValue, bitmask, customizer, key, value, stack),
      )
    }
  })

  return result
}

export default baseClone
