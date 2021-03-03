import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import BeeMill from './components'

function App() {
    return (
        <ChakraProvider>
            <BeeMill />
        </ChakraProvider>
    )
}

ReactDOM.render(<App />, document.getElementById('app'))
