/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {symbol} symbol The symbol to clone.
 * @returns {symbol} Returns the cloned symbol object.
 */
function cloneSymbol(symbol: symbol): symbol {
  // Wrap the symbol primitive into a symbol object.
  return Object(Symbol.prototype.valueOf.call(symbol))
}

export default cloneSymbol
