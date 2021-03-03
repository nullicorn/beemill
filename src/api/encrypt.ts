import * as tar from 'tar'
import { createCipheriv, createHash, randomBytes } from 'crypto'
import { createWriteStream } from 'fs'
import { PathItem, createEncryptResultPath } from '../api'

export function encrypt(pathItem: PathItem, password: string): Promise<boolean> {
    return new Promise(resolve => {
        try {
            const key = createHash('sha256').update(password).digest()
            const iv = randomBytes(16)
            const aes = createCipheriv('aes-256-gcm', key, iv)

            const resultPath = createEncryptResultPath(pathItem)

            // encrypt and write the result
            tar.create({ gzip: true, cwd: pathItem.directory }, [pathItem.fullFilename])
                .pipe(aes)
                .pipe(createWriteStream(resultPath))
                .on('error', () => resolve(false))
                .on('finish', () => {
                    // append metadata to the result (i.e. initialization vector, auth tag)
                    const auth = aes.getAuthTag()
                    const appendStream = createWriteStream(resultPath, { flags: 'a' })
                    appendStream.write(Buffer.concat([iv, auth]))
                    appendStream.end()
                    appendStream.on('error', () => resolve(false))
                    appendStream.on('finish', () => resolve(true))
                })
        } catch(_err) {
            resolve(false)
        }
    })
}