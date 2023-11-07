/** Used to match `RegExp` flags from their coerced string values. */
const reFlags = /\w*$/

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {object} regexp The regexp to clone.
 * @returns {object} Returns the cloned regexp.
 */
function cloneRegExp(regexp: RegExp): RegExp {
  // Extract the flags by converting the RegExp to a string and matching the flags
  const flagsMatch = reFlags.exec(regexp.toString())
  if (!flagsMatch)
    throw new Error('RegExp flags could not be determined.')

  // Construct a new RegExp using the source and the extracted flags
  const result = new RegExp(regexp.source, flagsMatch[0])
  result.lastIndex = regexp.lastIndex

  return result
}

export default cloneRegExp
