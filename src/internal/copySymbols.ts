import copyObject from './copyObject'
import getSymbols from './getSymbols'

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {object} source The object to copy symbols from.
 * @param {object} [object] The object to copy symbols to.
 * @returns {object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object)
}

export default copySymbols
