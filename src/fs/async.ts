import { constants, existsSync } from 'node:fs'
import {
  access,
  mkdir,
  readdir,
  rmdir,
  stat,
  unlink,
  writeFile,
} from 'node:fs/promises'
import { resolve } from 'node:path'
import minimatch from 'minimatch'
import type { PathLike } from 'node:fs'

/** @category fs - async */
export async function isPathAccessible(filePath: PathLike): Promise<boolean> {
  if (!existsSync(filePath)) {
    return false
  }
  try {
    await access(filePath, constants.R_OK)
    return true
  } catch {
    return false
  }
}

/** @category fs - sync */
export async function isValidDirPath(dirPath: PathLike): Promise<boolean> {
  const accessible = await isPathAccessible(dirPath)
  const stats = await stat(dirPath)
  return accessible && stats.isDirectory()
}

/** @category fs - sync */
export async function isValidFilePath(filePath: PathLike): Promise<boolean> {
  const accessible = await isPathAccessible(filePath)
  const stats = await stat(filePath)
  return accessible && stats.isFile()
}

/** @category fs - async */
export async function emptyDir(
  dirPath: PathLike,
  skips: string[] = []
): Promise<void> {
  dirPath = resolve(process.cwd(), dirPath.toString())
  const isValidDir = await isValidDirPath(dirPath)
  if (!isValidDir) {
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
export async function isEmptyDir(dirPath: PathLike): Promise<boolean> {
  const isValidDir = await isValidDirPath(dirPath)
  if (!isValidDir) {
    return false
  }
  const subItems = await readdir(dirPath)
  return subItems.length === 0
}

/** @category fs - async */
export async function writeFileRecursive(
  filename: string,
  content: string | NodeJS.ArrayBufferView,
  options?: Parameters<typeof writeFile>[2]
) {
  let filepath = filename.replace(/\\/g, '/')
  let root = ''
  if (filepath[0] === '/') {
    root = '/'
    filepath = filepath.slice(1)
  } else if (filepath[1] === ':') {
    root = filepath.slice(0, 3) // c:\
    filepath = filepath.slice(3)
  }

  const folders = filepath.split('/').slice(0, -1) // remove last item, file
  let accPath = ''
  for (const folder of folders) {
    const folderPath = `${accPath + folder}/`
    if (!existsSync(folderPath)) {
      await mkdir(folderPath)
    }
    accPath = folderPath
  }

  await writeFile(root + filepath, content, options)
}
