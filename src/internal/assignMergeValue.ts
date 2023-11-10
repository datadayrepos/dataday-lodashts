import eq from '../eq'
import baseAssignValue from './baseAssignValue'

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object: object, key: string, value?: any) {
  if ((value !== undefined && !eq(object[key], value))
      || (value === undefined && !(key in object)))
    baseAssignValue(object, key, value)
}

export default assignMergeValue
