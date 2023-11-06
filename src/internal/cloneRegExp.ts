/** Used to match `RegExp` flags from their coerced string values. */
const reFlags = /\w*$/

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {object} regexp The regexp to clone.
 * @returns {object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  const result = new regexp.constructor(regexp.source, reFlags.exec(regexp))
  result.lastIndex = regexp.lastIndex
  return result
}

export default cloneRegExp
