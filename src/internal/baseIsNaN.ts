/**
 * The base implementation of `isNaN` without support for number objects.
 * using the fact that NaN is the only value in javascript that is not equal to itself when compared using the !== operator.
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value: any): boolean {
  // NaN is the only value in JavaScript that is not equal to itself
  // eslint-disable-next-line no-self-compare
  return value !== value
}

export default baseIsNaN
