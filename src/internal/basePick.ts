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
function basePick(object: object, paths: string[]): object {
  return basePickBy(object, paths, (value: any, path: string) => hasIn(object, path))
}

export default basePick
