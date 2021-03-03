import { ipcRenderer } from 'electron'
import * as React from 'react'
import { LockIcon } from '@chakra-ui/icons'
import { Stack, Button, Text } from '@chakra-ui/react'
import PasswordInput from './PasswordInput'
import Loading from './Loading'
import Done from './Done'
import { PathItem } from '../api'

type Status = 'NOT_STARTED' | 'LOADING' | 'DONE'

interface EncryptProps {
    pathItem: PathItem
    setPathItem: (_: PathItem | null) => void
    password: string
    setPassword: (_: string) => void
}

function Encrypt(props: EncryptProps) {
    const { pathItem, setPathItem, password, setPassword } = props
    const [doubleCheck, setDoubleCheck] = React.useState<string>('')
    const [status, setStatus] = React.useState<Status>('NOT_STARTED')
    const onClickCancel = () => {
        setPassword('')
        setDoubleCheck('')
        setStatus('NOT_STARTED')
        setPathItem(null)
    }
    const onClickEncrypt = () => {
        setTimeout(async () => {
            if (await ipcRenderer.invoke('encrypt', pathItem, password)) {
                setStatus('DONE')
            } else {
                setStatus('NOT_STARTED')
                alert('Unable to encrypt the file. Unexpected error.')
            }
        }, 1000)
        setPassword('')
        setDoubleCheck('')
        setStatus('LOADING')
    }
    const isDisabled = !(password.length > 0 && password === doubleCheck)

    if (status === 'LOADING') {
        return <Loading text={`Encrypting "${pathItem.fullFilename}"`} />
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
            <Stack spacing={3}>
                <PasswordInput
                    key='pw1'
                    password={password}
                    setPassword={setPassword}
                    placeholder={'Enter password'}
                    autofocus={true}
                />
                <PasswordInput
                    key='pw2'
                    password={doubleCheck}
                    setPassword={setDoubleCheck}
                    placeholder={'Enter password again'}
                />
            </Stack>
            <Stack spacing={3}>
                <Button
                    leftIcon={<LockIcon />}
                    colorScheme='blue'
                    variant='solid'
                    onClick={onClickEncrypt}
                    isDisabled={isDisabled}
                >
                    Encrypt
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

export default Encrypt
