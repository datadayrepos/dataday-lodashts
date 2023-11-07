import assignValue from './assignValue'
import baseAssignValue from './baseAssignValue'

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Record<string, any>} source The object to copy properties from.
 * @param {Array<string>} props The property identifiers to copy.
 * @param {Record<string, any>} [object] The object to copy properties to.
 * @param {(value: any, srcValue: any, key: string, object: Record<string, any>, source: Record<string, any>) => any} [customizer] The function to customize copied values.
 * @returns {Record<string, any>} Returns `object`.
 */
function copyObject(
  source: Record<string, any>,
  props: Array<string>,
  object: Record<string, any> = {},
  customizer?: (value: any, srcValue: any, key: string, object: Record<string, any>, source: Record<string, any>) => any,
): Record<string, any> {
  for (const key of props) {
    let newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined

    if (newValue === undefined)
      newValue = source[key]

    assignValue(object, key, newValue)
  }
  return object
}

export default copyObject
