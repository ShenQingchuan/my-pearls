import {
  accessSync,
  constants,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
} from 'node:fs'
import { resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import minimatch from 'minimatch'
import type { PathLike } from 'node:fs'

/** @category fs - sync */
export function isFileReadableSync(filePath: PathLike): boolean {
  try {
    accessSync(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

/** @category fs - sync */
export function isDirExistsSync(dirPath: PathLike): boolean {
  const isReadable = isFileReadableSync(dirPath)
  const dirStat = statSync(dirPath)
  return isReadable && dirStat.isDirectory()
}

/** @category fs - sync */
export function emptyDirSync(dirPath: PathLike, skips: string[] = []): void {
  dirPath = resolve(process.cwd(), dirPath.toString())
  if (!isDirExistsSync(dirPath)) {
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
export async function isDirEmptySync(dirPath: PathLike): Promise<boolean> {
  const files = await readdir(dirPath)
  return files.length === 0
}
