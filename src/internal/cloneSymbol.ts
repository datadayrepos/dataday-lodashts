/** Used to convert symbols to primitives and strings. */
const symbolValueOf = Symbol.prototype.valueOf

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {object} symbol The symbol object to clone.
 * @returns {object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return Object(symbolValueOf.call(symbol))
}

export default cloneSymbol
