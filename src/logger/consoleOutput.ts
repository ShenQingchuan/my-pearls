/**
 * Prints messages to stdout with an '\n' at the end
 *
 * @category logger
 */
export function myPrintln(...msgs: string[]) {
  process.stdout.write(`${msgs.join(' ')}\n`)
}

/**
 * Prints messages to stdout without an '\n' at the end
 *
 * @category logger
 */
export function myPrint(...msgs: string[]) {
  process.stdout.write(msgs.join(' '))
}
