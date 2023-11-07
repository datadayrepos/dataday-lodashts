import isArguments from '../isArguments'
import isBuffer from '../isBuffer'
import isTypedArray from '../isTypedArray'
import isIndex from './isIndex'

/** Used to check objects for own properties. */
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value: any, inherited?: boolean): Array<any> {
  const isArr = Array.isArray(value)
  const isArg = !isArr && isArguments(value)
  const isBuff = !isArr && !isArg && isBuffer(value)
  const isType = !isArr && !isArg && !isBuff && isTypedArray(value)
  const skipIndexes = isArr || isArg || isBuff || isType
  const length = value.length
  // eslint-disable-next-line unicorn/no-new-array
  const result = skipIndexes ? new Array(length).fill(undefined) : []
  let index = skipIndexes ? -1 : length
  while (++index < length)
    result[index] = `${index}`

  for (const key in value) {
    if (
      (inherited || hasOwnProperty.call(value, key))
      && !(
        skipIndexes
        // Safari 9 has enumerable `arguments.length` in strict mode.
        && (key === 'length'
          // Skip index properties.
          || isIndex(key, length))
      )
    )
      result.push(key)
  }
  return result
}

export default arrayLikeKeys
