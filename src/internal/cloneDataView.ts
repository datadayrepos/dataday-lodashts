import cloneArrayBuffer from './cloneArrayBuffer'

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  const buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer
  return new dataView.constructor(
    buffer,
    dataView.byteOffset,
    dataView.byteLength,
  )
}

export default cloneDataView
