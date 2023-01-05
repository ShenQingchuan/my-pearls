/* eslint-disable no-console */

/** @private */
export type StepLoggerFormatter = (
  input: string | number | null | undefined
) => string

export interface PrintStepEndParams {
  endColor?: StepLoggerFormatter
  alterMsg?: string
}
export interface StepLoggerOptions {
  subject: string
  colorFn: StepLoggerFormatter
  logger?: (...args: any[]) => void
}

/**
 *  Print some log information for one function running some procedures
 *
 * @param options.subject Subject name for task step to be prefixed at printed message
 * @param options.colorFn Dyeing function to give text ASCII colors
 * @param options.logger Alternative logger function, default is `console.log`
 * @returns
 */
export function createLoggerForStep(options: StepLoggerOptions) {
  const { subject, colorFn, logger = console.log } = options
  return (
    stepDesc: string,
    step: (printStepEnd: (params: PrintStepEndParams) => void) => void
  ) => {
    const printStepEnd = ({ endColor, alterMsg }: PrintStepEndParams) =>
      logger(
        (endColor ? endColor : colorFn)(
          alterMsg
            ? `[${subject}] ${alterMsg}`
            : `[${subject}] Finished: ${stepDesc}`
        )
      )
    logger(colorFn(`[${subject}] Start: ${stepDesc} ...`))
    step(printStepEnd)
  }
}
