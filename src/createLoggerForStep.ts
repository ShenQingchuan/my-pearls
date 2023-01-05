/* eslint-disable no-console */
type Formatter = (input: string | number | null | undefined) => string

interface PrintStepEndParams {
  endColor?: Formatter
  alterMsg?: string
}
interface StepLoggerOptions {
  subject: string
  colorFn: Formatter
  logger: (...args: any[]) => void
}

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
