import getSymbols from './getSymbols'

/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
function getSymbolsIn(object: object) {
  const result: any[] = []
  while (object) {
    result.push(...getSymbols(object))
    object = Object.getPrototypeOf(Object(object))
  }
  return result
}

export default getSymbolsIn
