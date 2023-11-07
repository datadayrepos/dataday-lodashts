import eq from '../eq'
import baseAssignValue from './baseAssignValue'

/** Used to check objects for own properties. */
const hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent.
 *
 * @private
 * @param {object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue<T extends object>(object: T, key: keyof T, value: any): void {
  // We're checking if the value is already a number to ensure the division operation is safe.
  const objValue = object[key]
  if (typeof value === 'number' && typeof objValue === 'number') {
    if (!(hasOwnProperty.call(object, key) && eq(objValue, value))) {
      if (value !== 0 || 1 / value === 1 / objValue)
        baseAssignValue(object, key as string, value)
    }
    else if (value === undefined && !(key in object)) {
      baseAssignValue(object, key as string, value)
    }
  }
  else {
    // Handle non-number values here if necessary
  }
}

export default assignValue
