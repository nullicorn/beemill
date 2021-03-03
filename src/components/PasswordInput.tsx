import * as React from 'react'
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'

interface PasswordInputProps {
    password: string
    setPassword: (_: string) => void
    placeholder: string
    autofocus?: boolean
}

function PasswordInput(props: PasswordInputProps) {
    const { password, setPassword, placeholder, autofocus } = props
    const ref = React.useRef<HTMLInputElement | null>(null)
    const [show, setShow] = React.useState<boolean>(false)
    const handleClick = () => setShow(!show)
    const handleChange = (e: any) => {
        const str = e.target.value
        if (!isValidString(str)) {
            alert('That character is not supported.')
            return
        }
        setPassword(str)
    }

    React.useEffect(() => {
        if (ref && ref.current && autofocus) {
            ref.current.focus()
        }
    }, [ref])

    return (
        <InputGroup size='md'>
            <Input
                value={password}
                onChange={handleChange}
                pr='4.5rem'
                type={show ? 'text' : 'password'}
                placeholder={placeholder}
                ref={ref}
            />
            <InputRightElement width='4.5rem'>
                <Button h='1.75rem' size='sm' onClick={handleClick}>
                    {show ? 'Hide' : 'Show'}
                </Button>
            </InputRightElement>
        </InputGroup>
    )
}

function isValidString(str: string) {
    return /^[\x20-\x7E]*$/.test(str)
}

export default PasswordInput
