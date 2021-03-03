import { ipcRenderer } from 'electron'
import * as React from 'react'
import { UnlockIcon } from '@chakra-ui/icons'
import { Stack, Button, Text } from '@chakra-ui/react'
import PasswordInput from './PasswordInput'
import Loading from './Loading'
import Done from './Done'
import { PathItem } from '../api'

type Status = 'NOT_STARTED' | 'LOADING' | 'DONE'

interface DecryptProps {
    pathItem: PathItem
    setPathItem: (_: PathItem | null) => void
    password: string
    setPassword: (_: string) => void
}

function Decrypt(props: DecryptProps) {
    const { pathItem, setPathItem, password, setPassword } = props
    const [status, setStatus] = React.useState<Status>('NOT_STARTED')
    const onClickCancel = () => {
        setPassword('')
        setStatus('NOT_STARTED')
        setPathItem(null)
    }
    const onClickDecrypt = () => {
        setTimeout(async () => {
            if (await ipcRenderer.invoke('decrypt', pathItem, password)) {
                setStatus('DONE')
            } else {
                setStatus('NOT_STARTED')
                alert('Unable to decrypt the file. Password might have been incorrect.')
            }
        }, 1000)
        setPassword('')
        setStatus('LOADING')
    }
    const isDisabled = !(password.length > 0)

    if (status === 'LOADING') {
        return <Loading text={`Decrypting "${pathItem.fullFilename}"`} />
    }

    if (status === 'DONE') {
        return <Done {...{pathItem, setPathItem}} />
    }

    return (
        <Stack spacing={9} w='100%' m='6' maxW='500px'>
            <Text
                size='lg'
                fontWeight='bold'
                userSelect='none'
            >
                {pathItem.fullFilename}
            </Text>
            <PasswordInput
                password={password}
                setPassword={setPassword}
                placeholder={'Enter password'}
                autofocus={true}
            />
            <Stack spacing={3}>
                <Button
                    leftIcon={<UnlockIcon />}
                    colorScheme='blue'
                    variant='solid'
                    onClick={onClickDecrypt}
                    isDisabled={isDisabled}
                >
                    Decrypt
                </Button>
                <Button
                    colorScheme ='red'
                    variant='ghost'
                    onClick={onClickCancel}
                >
                    Cancel
                </Button>
            </Stack>
        </Stack>
    )

}

export default Decrypt
