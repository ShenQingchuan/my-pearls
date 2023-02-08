import {
  accessSync,
  constants,
  existsSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
} from 'node:fs'
import { resolve } from 'node:path'
import minimatch from 'minimatch'
import type { PathLike } from 'node:fs'

/** @category fs - sync */
export function isPathAccessibleSync(filePath: PathLike): boolean {
  if (!existsSync(filePath)) {
    return false
  }
  try {
    accessSync(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

/** @category fs - sync */
export function isValidDirPathSync(dirPath: PathLike): boolean {
  return isPathAccessibleSync(dirPath) && statSync(dirPath).isDirectory()
}

/** @category fs - sync */
export function isValidFilePathSync(filePath: PathLike): boolean {
  return isPathAccessibleSync(filePath) && statSync(filePath).isFile()
}

/** @category fs - sync */
export function emptyDirSync(dirPath: PathLike, skips: string[] = []): void {
  dirPath = resolve(process.cwd(), dirPath.toString())
  if (!isValidDirPathSync(dirPath)) {
    throw new Error(`Directory ${dirPath} does not exist`)
  }
  const files = readdirSync(dirPath)
  for (const filePath of files) {
    const fileAbsPath = resolve(dirPath.toString(), filePath.toString())
    if (skips?.some((skip) => minimatch(fileAbsPath, skip, { dot: true }))) {
      continue
    }
    const file = statSync(fileAbsPath)
    if (file.isDirectory()) {
      emptyDirSync(filePath, skips)
      rmdirSync(fileAbsPath)
    } else {
      unlinkSync(fileAbsPath)
    }
  }
}

/** @category fs - sync */
export function isEmptyDirSync(dirPath: PathLike): boolean {
  if (!isValidDirPathSync(dirPath)) {
    return false
  }
  const subItems = readdirSync(dirPath)
  return subItems.length === 0
}
