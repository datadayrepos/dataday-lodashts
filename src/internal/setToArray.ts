/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Set<any>} set The set to convert.
 * @returns {Array<any>} Returns the array of values.
 */
function setToArray(set: Set<any>): Array<any> {
  const result: Array<any> = []

  set.forEach((value) => {
    result.push(value)
  })

  return result
}

export default setToArray
