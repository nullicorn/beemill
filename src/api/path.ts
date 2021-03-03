import * as path from 'path'
import * as fs from 'fs'
import { shell } from 'electron'

const BEEMILL_EXT = '.beemill'

export interface PathItem {
    fullPath: string
    directory: string
    fullFilename: string
    filename: string
    extension?: string
    isDirectory: boolean
    isBeeMillFile: boolean
}

export function pathStrToPathItem(pathStr: string): PathItem {
    const fullFilename = path.basename(pathStr)
    const extension = path.extname(pathStr) !== '' ? path.extname(pathStr) : undefined
    const filename = fullFilename.replace(extension, '')

    return {
        fullFilename,
        extension,
        filename,
        fullPath: pathStr,
        directory: path.dirname(pathStr),
        isDirectory: fs.lstatSync(pathStr).isDirectory(),
        isBeeMillFile: extension === BEEMILL_EXT
    }
}

export function createEncryptResultPath(pathItem: PathItem): string | null {
    const { directory, filename } = pathItem

    let i = 2
    let result = path.join(directory, `${filename}${BEEMILL_EXT}`)
    try {
        // Increment resulting filename until it doesn't conflict with existing files
        while (fs.existsSync(result)) {
            result = path.join(directory, `${filename} ${i}${BEEMILL_EXT}`)
            i += 1
        }
        return result
    } catch(_err) {
        return null
    }
}

export function createDecryptResultPath(pathItem: PathItem): string | null {
    const { directory, filename } = pathItem

    let i = 2
    let result = path.join(directory, filename)
    try {
        // Incremet resulting directory until it doesn't conflict with existing files
        while (fs.existsSync(result)) {
            result = path.join(directory, `${filename} ${i}`)
            i += 1
        }
        fs.mkdirSync(result)
        return result
    } catch(_err) {
        return null
    }
}

export function openPath(pathStr: string) {
    shell.showItemInFolder(pathStr)
}
