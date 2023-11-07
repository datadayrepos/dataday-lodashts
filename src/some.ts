/**
 * Checks if `predicate` returns truthy for **any** element of `array`.
 * Iteration is stopped once `predicate` returns truthy. The predicate is
 * invoked with three arguments: (value, index, array).
 *
 * @since 5.0.0
 * @category Array
 * @param {Array} array The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 * @example
 *
 * some([null, 0, 'yes', false], Boolean)
 * // => true
 */
function some<T>(
  array: T[] | null,
  predicate: (value: T, index: number, array: T[]) => boolean,
): boolean {
  if (array === null)
    return false

  const length = array.length

  for (let index = 0; index < length; index++) {
    if (predicate(array[index], index, array))
      return true
  }

  return false
}

export default some
