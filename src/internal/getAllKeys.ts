import keys from '../keys'
import getSymbols from './getSymbols'

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object: object): Array<any> {
  const result = keys(object)
  if (!Array.isArray(object))
    result.push(...getSymbols(object))

  return result
}

export default getAllKeys
