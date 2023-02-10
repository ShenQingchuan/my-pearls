import {
  accessSync,
  constants,
  existsSync,
  mkdirSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
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

/** @category fs - sync */
export function writeFileSyncRecursive(
  filename: string,
  content: string | NodeJS.ArrayBufferView,
  options?: Parameters<typeof writeFileSync>[2]
) {
  // -- normalize path separator to '/' instead of path.sep,
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g, '/')

  // -- preparation to allow absolute paths as well
  let root = ''
  if (filepath[0] === '/') {
    root = '/'
    filepath = filepath.slice(1)
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3) // c:\
    filepath = filepath.slice(3)
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1) // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = `${acc + folder}/`
      if (!existsSync(folderPath)) {
        mkdirSync(folderPath)
      }
      return folderPath
    },
    root // first 'acc', important
  )

  // -- write file
  writeFileSync(root + filepath, content, options)
}
