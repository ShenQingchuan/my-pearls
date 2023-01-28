import stringWidth from 'string-width'

const MOVE_LEFT = Buffer.from('1b5b3130303044', 'hex').toString()
const MOVE_UP = Buffer.from('1b5b3141', 'hex').toString()
const CLEAR_LINE = Buffer.from('1b5b304b', 'hex').toString()

let isPrevSingleLinePrint = false

/**
 * Prints messages to stdout without an '\n' at the end
 *
 * @category logger
 */
export function myPrint(...msgs: string[]) {
  if (isPrevSingleLinePrint) {
    process.stdout.write('\n')
    isPrevSingleLinePrint = false
  }
  process.stdout.write(msgs.join(' '))
}

/**
 * Prints messages to stdout with an '\n' at the end
 *
 * @category logger
 */
export function myPrintln(...msgs: string[]) {
  myPrint(...msgs, '\n')
}

function createSingleLinePrint(stream: NodeJS.WriteStream = process.stdout) {
  const write = stream.write
  let str: string | null = ''
  let prevLineCount = 0

  process.stdout.write = (...args) => {
    if (str && args[0] !== str) {
      str = null
    }
    return write.apply(process.stdout, args as Parameters<typeof write>)
  }
  if (stream === process.stderr || stream === process.stdout) {
    process.on('exit', () => {
      if (str !== null) {
        stream.write('')
      }
    })
  }

  return (...args: string[]) => {
    str = ''
    const nextStr = args.join(' ')
    // Clear screen
    for (let i = 0; i < prevLineCount; i++) {
      str += MOVE_LEFT + CLEAR_LINE + (i < prevLineCount - 1 ? MOVE_UP : '')
    }

    // Actual log output
    str += nextStr
    stream.write(str)

    // Compute how many lines to remove on next clear screen
    const prevLines = nextStr.split('\n')
    prevLineCount = 0
    for (const prevLine of prevLines) {
      prevLineCount += Math.ceil(stringWidth(prevLine) / stream.columns) || 1
    }
    isPrevSingleLinePrint = true
  }
}

/**
 * Keeping printing messages on a single line.
 *
 * If another my-print function is called, the last output will be remained.
 *
 * @category logger
 */
export const mySingleLinePrint = createSingleLinePrint()
