import basePick from './internal/basePick'

/**
 * Creates an object composed of the picked `object` properties.
 *
 * @since 0.1.0
 * @category Object
 * @param {object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to pick.
 * @returns {object} Returns the new object.
 * @example
 *
 * const object = { 'a': 1, 'b': '2', 'c': 3 }
 *
 * pick(object, ['a', 'c'])
 * // => { 'a': 1, 'c': 3 }
 */
export function pick(object: object, ...paths: (string | string[])[]): object {
  // Flatten paths to a single array of strings
  const flatPaths = paths.flat()

  // Check if each element in flatPaths is string
  const allStrings = flatPaths.every(path => typeof path === 'string')

  if (!allStrings)
    throw new Error('All paths must be strings')

  return object == null ? {} : basePick(object, flatPaths as string[])
}

export default pick
