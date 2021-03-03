import * as React from 'react'
import { Stack, Spinner, Center, Text } from '@chakra-ui/react'

interface LoadingProps {
    text: string
}

function Loading(props: LoadingProps) {
    return (
        <Stack spacing='12'>
            <Center>
                <Spinner
                    size='xl'
                    speed='1.2s'
                    thickness='3px'
                />
            </Center>
            <Text
                fontSize='lg'
                align='center'
                fontWeight='bold'
                userSelect='none'
            >
                {props.text}
            </Text>
        </Stack>
    )
}

export default Loading
