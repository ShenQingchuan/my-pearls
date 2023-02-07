/**
 *  Split items of an iterable collection into small chunks array with given count.
 *
 * @param iterable Iterable collection types, such as Array, Set ...const
 * @param chunkSize How many items in one chunk
 * @returns chunks with the given `chunkSize`, but the last item may have less than that due to not enough
 *
 * @category Other
 */
export function splitIntoChunks<T>(
  iterable: Array<T> | Set<T>,
  chunkSize: number
): T[][] {
  const res: T[][] = []
  const arrayify = [...iterable]
  while (arrayify.length > 0) {
    const chunk = arrayify.splice(0, chunkSize)
    res.push(chunk)
  }
  return res
}
