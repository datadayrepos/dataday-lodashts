/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Map<any, any>} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map: Map<any, any>): Array<[any, any]> {
  const result: Array<[any, any]> = []

  map.forEach((value, key) => {
    result.push([key, value])
  })

  return result
}

export default mapToArray
