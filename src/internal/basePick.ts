import hasIn from '../hasIn'
import basePickBy from './basePickBy'

/**
 * The base implementation of `pick` without support for individual
 * property identifiers.
 *
 * @private
 * @param {object} object The source object.
 * @param {string[]} paths The property paths to pick.
 * @returns {object} Returns the new object.
 */
function basePick(object, paths) {
  // @ts-expect-error
  return basePickBy(object, paths, (value, path) => hasIn(object, path))
}

export default basePick
