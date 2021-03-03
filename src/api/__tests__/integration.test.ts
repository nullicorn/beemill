import { encrypt, decrypt, PathItem, pathStrToPathItem } from '..'
import * as fs from 'fs'
import * as path from 'path'

const testDirectory = path.join(__dirname, '.test-tmp')
const testFilename = 'test'
const testExtension = '.txt'
const testFullPath = path.join(testDirectory, testFilename + testExtension)
const testFileContent = generateRandomText(1_000_000) // ~1MB
const testPassword = 'correct_password'

// Create a test directory containing test file
beforeAll(() => {
    // Delete if test directory already exists
    if (fs.existsSync(testDirectory)) {
        fs.rmdirSync(testDirectory, { recursive: true })
    }

    // Create test directory
    fs.mkdirSync(testDirectory)

    // Create test file
    fs.writeFileSync(testFullPath, testFileContent, 'utf8')
})

// Delete the test directory recursively
afterAll(() => {
        if (fs.existsSync(testDirectory)) {
            fs.rmdirSync(testDirectory, { recursive: true })
        }
})

describe('full integration test', () => {
    const expectedPlainPathItem: PathItem = {
        fullPath: testFullPath,
        directory: testDirectory,
        fullFilename: testFilename + testExtension,
        filename: testFilename,
        extension: testExtension,
        isDirectory: false,
        isBeeMillFile: false
    }

    const expectedEncryptedPathItem: PathItem = {
        fullPath: path.join(testDirectory, `${testFilename}.beemill`),
        directory: testDirectory,
        fullFilename: testFilename + '.beemill',
        filename: testFilename,
        extension: '.beemill',
        isDirectory: false,
        isBeeMillFile: true
    }

    const expectedDecryptedPathItem: PathItem = {
        fullPath: path.join(testDirectory, testFilename, expectedPlainPathItem.fullFilename),
        directory: path.join(testDirectory, testFilename),
        fullFilename: expectedPlainPathItem.fullFilename,
        filename: testFilename,
        extension: testExtension,
        isDirectory: false,
        isBeeMillFile: false
    }

    test('test the app flow: path -> encrypt -> decrypt', async () => {
        // create a path item from target text file
        const actualPlainPathItem = pathStrToPathItem(testFullPath)
        expect(actualPlainPathItem).toEqual(expectedPlainPathItem)

        // encrypt the target text file
        const encryptResult = await encrypt(actualPlainPathItem, testPassword)
        expect(encryptResult).toEqual(true)
        expect(fs.existsSync(expectedEncryptedPathItem.fullPath)).toEqual(true)

        // create a path item of the encrypted file
        const actualEncryptedPathItem = pathStrToPathItem(expectedEncryptedPathItem.fullPath)
        expect(actualEncryptedPathItem).toEqual(expectedEncryptedPathItem)

        // decrypt with wrong password
        const decryptWrongPasswordResult = await decrypt(actualEncryptedPathItem, 'wrong_password')
        expect(decryptWrongPasswordResult).toEqual(false)

        // decrypt the encrypted file
        const decryptResult = await decrypt(actualEncryptedPathItem, testPassword)
        expect(decryptResult).toEqual(true)
        expect(fs.existsSync(expectedDecryptedPathItem.fullPath)).toEqual(true)

        // create a path item of the decrypted file
        const actualDecryptedFilePathItem = pathStrToPathItem(expectedDecryptedPathItem.fullPath)
        expect(actualDecryptedFilePathItem).toEqual(expectedDecryptedPathItem)

        // check that the decrpyted file has the same content as the original text file
        expect(
            diffFileContent(
                actualPlainPathItem.fullPath,
                actualDecryptedFilePathItem.fullPath
            )
        ).toEqual(true)
    })
})

function diffFileContent(path1: string, path2: string) {
    const content1 = fs.readFileSync(path1, 'base64')
    const content2 = fs.readFileSync(path2, 'base64')
    return content1 === content2
}

function generateRandomText(size: number) {
    const result: string[] = []
    const source = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < size; i++) {
        result.push(source.charAt(Math.floor(Math.random() * source.length)))
    }
    return result.join('')
}