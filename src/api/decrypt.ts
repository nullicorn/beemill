import * as tar from 'tar'
import { createDecipheriv, createHash } from 'crypto'
import { createReadStream, statSync, rmdirSync } from 'fs'
import { PathItem, createDecryptResultPath } from '../api'

export function decrypt(pathItem: PathItem, password: string): Promise<boolean> {
    return new Promise(resolve => {
        try {
            const fileSize = statSync(pathItem.fullPath).size
            const metaStart = fileSize - 32

            // retrieve metadata (i.e. initialization vector, auth tag) from the end of the file
            const readMeta = createReadStream(pathItem.fullPath, { start: metaStart })
            let auth = Buffer.from('')
            let iv = Buffer.from('')
            readMeta.on('data', (chunk: Buffer) => {
                iv = chunk.slice(0, 16)
                auth = chunk.slice(16)
            })

            // decrypt the file once we have obtained iv, auth tag
            readMeta.on('close', () => {
                const key = createHash('sha256').update(password).digest()
                const aes = createDecipheriv('aes-256-gcm', key, iv)
                aes.setAuthTag(auth)

                const resultPath = createDecryptResultPath(pathItem)
                // trim off metadata when reading the file
                const readStream = createReadStream(pathItem.fullPath, { end: metaStart - 1 })

                const error = () => {
                    rmdirSync(resultPath, { recursive: true })
                    resolve(false)
                }

                readStream
                    .pipe(aes)
                    .on('error', error) // wrong password
                    .pipe(tar.extract({ cwd: resultPath }))
                    .on('error', error) // unexpected error
                    .on('finish', () => resolve(true))
            })
        } catch(_err) {
            resolve(false)
        }
    })
}
