import copyObject from './copyObject'
import getSymbolsIn from './getSymbolsIn'

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {object} source The object to copy symbols from.
 * @param {object} [object] The object to copy symbols to.
 * @returns {object} Returns `object`.
 */
function copySymbolsIn(source: object, object: object): object {
  return copyObject(source, getSymbolsIn(source), object)
}

export default copySymbolsIn
