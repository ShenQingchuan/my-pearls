/**
 * Generate an unique id. <br>
 *
 * @param len specify the length of the id
 * @param radix specify the character scope size for random generated UUID bit
 * @returns {string} UUID string
 *
 * @category Other
 */
export function getUniqueId(options?: { length?: number; radix?: number }) {
  let { length, radix = 62 } = options ?? { radix: 62 }
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const uuid = []
  let i = null
  let r = null
  let randomNum = null
  const alphabetLen = alphabet.length
  radix = radix || alphabetLen
  radix = radix > alphabetLen ? alphabetLen : radix
  if (length) {
    // Compact form id
    for (i = 0; i < length; i++) {
      randomNum = 0 | (Math.random() * radix)
      uuid[i] = alphabet[randomNum]
    }
  } else {
    // Standard UUID
    // RFC 4122, version 4 form, requires these characters
    uuid[8] = '-'
    uuid[13] = '-'
    uuid[18] = '-'
    uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = alphabet[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
