import * as React from 'react'
import { Stack, Center, Text, Button } from '@chakra-ui/react'
import { PathItem, openPath } from '../api'

interface DoneProps {
    pathItem: PathItem
    setPathItem: (_: PathItem | null) => void
}

function Done(props: DoneProps) {
    const { pathItem, setPathItem } = props
    const onClickOpen = () => {
        openPath(pathItem.fullPath)
    }
    const onClickBack = () => {
        setPathItem(null)
    }
    const message = `Saved to "${pathItem.directory}"`

    return (
        <Stack spacing='12'>
            <Text
                size='lg'
                fontWeight='bold'
                align='center'
                userSelect='none'
            >
                {message}
            </Text>
            <Stack spacing='3'>
                <Button
                    colorScheme='blue'
                    variant='solid'
                    onClick={onClickOpen}
                >
                    Open
                </Button>
                <Button
                    colorScheme='blackAlpha'
                    variant='ghost'
                    onClick={onClickBack}
                >
                    Back
                </Button>
            </Stack>
        </Stack>
    )
}

export default Done
