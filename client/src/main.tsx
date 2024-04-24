import '@fontsource/inter'
import App from './App.tsx'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { ChakraProvider, ThemeConfig } from '@chakra-ui/react'
import { ColorModeScript, extendTheme } from '@chakra-ui/react'

const theme: ThemeConfig = extendTheme({
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false,
    },
    colors: {
        brand: {
            900: '#1a365d',
            800: '#153e75',
            700: '#2a69ac',
        },
        // gray: {
        //     50: '#f2f2f3',
        //     100: '#d7d7d7',
        //     200: '#bcbcbc',
        //     300: '#a3a3a3',
        //     400: '#888888',
        //     500: '#6f6f6f',
        //     600: '#565656',
        //     700: '#3d3d3d',
        //     800: '#252525',
        //     900: '#0c0c0d',
        // },
    },
    fonts: {
        heading: `'Inter', sans-serif`,
        body: `'Inter', sans-serif`,
    },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ColorModeScript initialColorMode={theme.initialColorMode} />
        <ChakraProvider theme={theme}>
            <App />
        </ChakraProvider>
    </React.StrictMode>
)
