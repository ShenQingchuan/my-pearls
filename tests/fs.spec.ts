import {
  chmodSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { describe, expect, test } from 'vitest'
import {
  emptyDir,
  isEmptyDir,
  isPathAccessible,
  isValidDirPath,
  isValidFilePath,
} from '../src/fs/async'
import {
  emptyDirSync,
  isEmptyDirSync,
  isValidDirPathSync,
  isValidFilePathSync,
} from '../src/fs/sync'

const MOCK_FILES_ROOT = '/tmp/my-pearl-test-files/fs/'

const getMockFilesPath = ({ sync }: { sync: boolean }) => {
  const MOCK_FILES_DIR = `${MOCK_FILES_ROOT}${sync ? 'sync' : 'async'}`
  const NON_READABLE_FILE = `${MOCK_FILES_DIR}/non-readable-file`
  const READABLE_FILE = `${MOCK_FILES_DIR}/readable-file`
  return [MOCK_FILES_DIR, NON_READABLE_FILE, READABLE_FILE]
}

function mockFilesToRunTest(runFn: () => void, sync = false) {
  const [MOCK_FILES_DIR, NON_READABLE_FILE, READABLE_FILE] = getMockFilesPath({
    sync,
  })
  mkdirSync(MOCK_FILES_DIR, { recursive: true })

  // Create a non-readable file
  writeFileSync(NON_READABLE_FILE, 'This is a non-readable-file.')
  chmodSync(NON_READABLE_FILE, 0o000)

  // Create a readable file
  writeFileSync(READABLE_FILE, 'This is a readable-file.')
  chmodSync(READABLE_FILE, 0o644)

    // Create some files in sub-directories
    ;[1, 2, 3].forEach((e) => {
      const subDirPath = `${MOCK_FILES_DIR}/sub-dir-${e}`
      mkdirSync(subDirPath)
        ;['txt', 'md', 'html'].forEach((ext) => {
          writeFileSync(
            `${subDirPath}/sub-dir-${e}-file.${ext}`,
            `This is a .${ext} file in sub-directory ${e}.`
          )
        })
    })

  runFn()

  // Clean test files
  rmSync(MOCK_FILES_ROOT, { recursive: true, force: true })
}

describe('MyPearl:fs', () => {
  test.concurrent('Synchronous functions', () => {
    const [MOCK_FILES_DIR, NON_READABLE_FILE, READABLE_FILE] = getMockFilesPath(
      { sync: true }
    )
    mockFilesToRunTest(() => {
      test('isDirExistsSync', () => {
        expect(isValidDirPathSync(MOCK_FILES_DIR)).toBeTruthy()
        expect(isValidDirPathSync(`${MOCK_FILES_DIR}/sub-dir-1`)).toBeTruthy()
      })
      test('isFileReadableSync', () => {
        expect(isValidFilePathSync(READABLE_FILE)).toBeTruthy()
        expect(isValidFilePathSync(NON_READABLE_FILE)).toBeFalsy()
      })
      test('emptyDirSync, isEmptyDirSync', () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-1`
        emptyDirSync(subDirPath)
        expect(isEmptyDirSync(subDirPath)).toBeTruthy()
      })
      test('emptyDirSync with skips', () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-2`
        emptyDirSync(subDirPath, ['*.md'])
        expect(existsSync(`${subDirPath}/sub-dir-2-file.md`)).toBeTruthy()
        expect(existsSync(`${subDirPath}/sub-dir-2-file.txt`)).toBeFalsy()
      })
    })
  })

  test.concurrent('Asynchronous functions', () => {
    const [MOCK_FILES_DIR, NON_READABLE_FILE, READABLE_FILE] = getMockFilesPath(
      { sync: false }
    )
    mockFilesToRunTest(() => {
      test('isValidDirPath', async () => {
        expect(await isValidDirPath(MOCK_FILES_DIR)).toBeTruthy()
        expect(await isValidDirPath(`${MOCK_FILES_DIR}/sub-dir-1`)).toBeTruthy()
      })
      test('isPathAccessible', async () => {
        expect(await isValidFilePath(READABLE_FILE)).toBeTruthy()
        expect(await isPathAccessible(NON_READABLE_FILE)).toBeFalsy()
      })
      test('emptyDir, isEmptyDir', async () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-1`
        await emptyDir(subDirPath)
        expect(await isEmptyDir(subDirPath)).toBeTruthy()
      })
      test('emptyDir with skips', async () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-2`
        await emptyDir(subDirPath, ['*.md'])
        expect(existsSync(`${subDirPath}/sub-dir-2-file.md`)).toBeTruthy()
        expect(existsSync(`${subDirPath}/sub-dir-2-file.txt`)).toBeFalsy()
      })
    })
  })
})
