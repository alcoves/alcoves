import { Box, Button } from '@chakra-ui/react'

export default function DevelopmentCSS() {
  const handleClick = () => {
    const currentState = window.localStorage.getItem('dev-css')

    if (currentState === 'true') {
      window.localStorage.setItem('dev-css', 'false')
    } else {
      window.localStorage.setItem('dev-css', 'true')
    }

    window.location.reload()
  }

  return (
    <>
      <Box>
        <Button p="4" onClick={handleClick}>
          Toggle Dev CSS
        </Button>
      </Box>

      {window.localStorage.getItem('dev-css') === 'true' && (
        <style>
          {`
          * {
            outline: 1px solid red;
          }

          *:hover {
            outline: 2px solid blue;
          }
        `}
        </style>
      )}
    </>
  )
}
