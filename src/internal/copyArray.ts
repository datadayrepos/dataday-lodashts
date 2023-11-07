/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source: Array<any>, array: Array<any>): Array<any> {
  let index = -1
  const length = source.length

  if (!array)
    array = Array.from({ length }) // This creates a new array with the same length as `source`

  while (++index < length)
    array[index] = source[index]

  return array
}

export default copyArray
