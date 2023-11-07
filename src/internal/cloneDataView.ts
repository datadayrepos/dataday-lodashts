import cloneArrayBuffer from './cloneArrayBuffer'

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {DataView} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {DataView} Returns the cloned data view.
 */
function cloneDataView(dataView: DataView, isDeep: boolean = false): DataView {
  const buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer
  return new DataView(buffer, dataView.byteOffset, dataView.byteLength)
}

export default cloneDataView
