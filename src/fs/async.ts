import { constants, readdirSync } from 'node:fs'
import { access, readdir, rmdir, stat, unlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import minimatch from 'minimatch'
import type { PathLike } from 'node:fs'

/** @category fs - async */
export async function isFileReadable(filePath: PathLike): Promise<boolean> {
  try {
    await access(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

/** @category fs - async */
export async function isDirExists(dirPath: PathLike): Promise<boolean> {
  const isReadable = await isFileReadable(dirPath)
  const dirStat = await stat(dirPath)
  return isReadable && dirStat.isDirectory()
}

/** @category fs - async */
export async function emptyDir(
  dirPath: PathLike,
  skips: string[] = []
): Promise<void> {
  dirPath = resolve(process.cwd(), dirPath.toString())
  if (!isDirExists(dirPath)) {
    throw new Error(`Directory ${dirPath} does not exist`)
  }
  const files = await readdir(dirPath)
  for (const filePath of files) {
    const fileAbsPath = resolve(dirPath.toString(), filePath.toString())
    if (skips?.some((skip) => minimatch(fileAbsPath, skip, { dot: true }))) {
      continue
    }
    const file = await stat(fileAbsPath)
    if (file.isDirectory()) {
      await emptyDir(filePath, skips)
      await rmdir(fileAbsPath)
    } else {
      await unlink(fileAbsPath)
    }
  }
}

/** @category fs - async */
export function isDirEmpty(dirPath: PathLike): boolean {
  const files = readdirSync(dirPath)
  return files.length === 0
}
