import * as React from 'react'
import { Center } from '@chakra-ui/react'

import DragAndDrop from './DragAndDrop'
import Encrypt from './Encrypt'
import Decrypt from './Decrypt'
import { PathItem } from '../api'

function BeeMill() {
    const [pathItem, setPathItem] = React.useState<PathItem | null>(null)
    const [password, setPassword] = React.useState<string>('')

    const showDragAndDrop = pathItem === null ? 
        <DragAndDrop {...{setPathItem}} /> :
        null
    const showEncrypt = pathItem !== null && !pathItem.isBeeMillFile ?
        <Encrypt {...{pathItem, setPathItem, password, setPassword}} /> :
        null
    const showDecrypt = pathItem !== null && pathItem.isBeeMillFile ?
        <Decrypt {...{pathItem, setPathItem, password, setPassword}} /> :
        null

    return (
        <Center minW='100vw' minH='100vh'>
            {showDragAndDrop}
            {showEncrypt}
            {showDecrypt}
        </Center>
    )

}

export default BeeMill
