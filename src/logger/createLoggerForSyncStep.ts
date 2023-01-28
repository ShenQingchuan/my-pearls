import { myPrintln } from './consoleOutput'

/** @private */
export type StepLoggerFormatter = (
  input: string | number | null | undefined
) => string

export interface PrintStepEndParams {
  endColor?: StepLoggerFormatter
  endMsg?: string
}
export interface StepLoggerOptions {
  subject: string
  colorFn: StepLoggerFormatter
  logger?: (...args: any[]) => void
}

/**
 * Print some log information for one function running some procedures
 *
 * ## Example
 *
 * ```js
 * import { Colorful } from 'my-pearls'
 *
 * const logger = createLoggerForSyncStep({
 *   subject: 'MySubject',
 *   colorFn: Colorful.green,
 * })(
 *   'Step 1',
 *   (printStepEnd) => {
 *     const [result, err] = do_something();
 *     printStepEnd(
 *       err
 *         ? { endColor: Colorful.red, endMsg: 'Step 1 Failed' }
 *         : { endMsg: `Step 1 Success. Result: ${result}` }
 *     );
 *   }
 * )
 * ```
 * @param options.subject Subject name for task step to be prefixed at printed message
 * @param options.colorFn Dyeing function to give text ASCII colors
 * @param options.logger Alternative logger function, default is `console.log`
 *
 * @category logger
 */
export function createLoggerForSyncStep(options: StepLoggerOptions) {
  const { subject, colorFn, logger = myPrintln } = options
  return (
    stepDesc: string,
    step: (printStepEnd: (params: PrintStepEndParams) => void) => void
  ) => {
    const printStepEnd = ({ endColor, endMsg }: PrintStepEndParams) =>
      logger(
        (endColor ? endColor : colorFn)(
          endMsg
            ? `[${subject}] ${endMsg}`
            : `[${subject}] Finished: ${stepDesc}`
        )
      )
    logger(colorFn(`[${subject}] Start: ${stepDesc} ...`))
    step(printStepEnd)
  }
}
