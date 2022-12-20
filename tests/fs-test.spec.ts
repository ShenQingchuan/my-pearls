import {
  chmodSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { assert, describe, test } from 'vitest'
import {
  emptyDir,
  isDirEmpty,
  isDirExists,
  isFileReadable,
} from '../src/fs/async'
import {
  emptyDirSync,
  isDirEmptySync,
  isDirExistsSync,
  isFileReadableSync,
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
        assert.ok(isDirExistsSync(MOCK_FILES_DIR))
        assert.ok(isDirExistsSync(`${MOCK_FILES_DIR}/sub-dir-1`))
      })
      test('isFileReadableSync', () => {
        assert.ok(isFileReadableSync(READABLE_FILE))
        assert.notOk(isFileReadableSync(NON_READABLE_FILE))
      })
      test('emptyDirSync, isDirEmptySync', () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-1`
        emptyDirSync(subDirPath)
        assert.ok(isDirEmptySync(subDirPath))
      })
      test('emptyDirSync with skips', () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-2`
        emptyDirSync(subDirPath, ['*.md'])
        assert.ok(existsSync(`${subDirPath}/sub-dir-2-file.md`))
        assert.notOk(existsSync(`${subDirPath}/sub-dir-2-file.txt`))
      })
    })
  })

  test.concurrent('Asynchronous functions', () => {
    const [MOCK_FILES_DIR, NON_READABLE_FILE, READABLE_FILE] = getMockFilesPath(
      { sync: false }
    )
    mockFilesToRunTest(() => {
      test('isDirExists', async () => {
        assert.ok(await isDirExists(MOCK_FILES_DIR))
        assert.ok(await isDirExists(`${MOCK_FILES_DIR}/sub-dir-1`))
      })
      test('isFileReadable', async () => {
        assert.ok(await isFileReadable(READABLE_FILE))
        assert.notOk(await isFileReadable(NON_READABLE_FILE))
      })
      test('emptyDir, isDirEmpty', async () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-1`
        await emptyDir(subDirPath)
        assert.ok(await isDirEmpty(subDirPath))
      })
      test('emptyDir with skips', async () => {
        const subDirPath = `${MOCK_FILES_DIR}/sub-dir-2`
        await emptyDir(subDirPath, ['*.md'])
        assert.ok(existsSync(`${subDirPath}/sub-dir-2-file.md`))
        assert.notOk(existsSync(`${subDirPath}/sub-dir-2-file.txt`))
      })
    })
  })
})
