import * as React from 'react'
import { Center, Stack, Text, Image } from '@chakra-ui/react'
import { PathItem, pathStrToPathItem } from '../api'
// @ts-ignore
import FolderIcon from '../assets/folder.svg'

interface DragAndDropProps {
    setPathItem: (_: PathItem | null) => void
}

function DragAndDrop(props: DragAndDropProps) {
    const [fileDrag, setFileDrag] = React.useState<boolean>(false)

    const preventDefault = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const getFiles = (e: any) => {
        preventDefault(e)
        const paths = []
        for (const f of e.dataTransfer.files) {
            paths.push(f.path)
        }
        if (paths.length > 1) {
            alert('Only drag & drop a single file or folder.')
            return
        }
        // TODO size check
        const pathItem = pathStrToPathItem(paths[0])
        props.setPathItem(pathItem)
    }

    React.useEffect(() => {
        window.addEventListener('drop', getFiles)
        window.addEventListener('dragover', preventDefault)

        return () => {
            window.removeEventListener('drop', getFiles)
            window.removeEventListener('dragover', preventDefault)
        }
    }, [])


    return (
        <Center
            bg={fileDrag ? '#e8e8e8' : 'white'}
            minW='100vw'
            minH='100vh'
            onDragEnter={() => setFileDrag(true)}
            onDragLeave={() => setFileDrag(false)}
            onDrop={() => setFileDrag(false)}
        >
            <div
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'transparent'
                }}
            />
            <Stack spacing='3'>
                <Center>
                    <Image src={FolderIcon} boxSize='100px' />
                </Center>
                <Text
                    fontSize='lg'
                    align='center'
                    fontWeight='bold'
                    userSelect='none'
                >
                    Drag & drop here
                </Text>
            </Stack>
        </Center>
    )
}

export default DragAndDrop
