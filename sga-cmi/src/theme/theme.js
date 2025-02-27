import { extendTheme } from '@chakra-ui/react';
import "@fontsource/public-sans";
import "@fontsource/rubik"

const theme = extendTheme({
  fonts: {
    heading: `"Public Sans", sans-serif`,
    body: `"Rubik", sans-serif`,
  },
  colors: {
    primary: {
      50: '#ffffff',
      100: '#6161F8',
      200: '#5252F8',
      300: '#4141F7',
      400: '#2020F6',
      500: '#0A0AE9', 
      600: '#060696',
      700: '#ffffff1f',
      800: '#ffffff33',
      900: '#242424',
      1000: '#151822',
      1100: '#0b0f19',
    },
  },
})

export default theme
