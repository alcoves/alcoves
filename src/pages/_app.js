import '../styles/index.css';
import Head from 'next/head';
import { merge, } from 'lodash';
import { ThemeProvider, defaultTheme, } from 'evergreen-ui';
import { Provider, } from '../utils/store';

const theme = merge(defaultTheme, {
  // typography: {
  //   fontFamilies: {
  //     ui: 'Montserrat',
  //     mono: 'Montserrat',
  //     display: 'Montserrat',
  //   },
  // },
});

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <ThemeProvider value={theme}>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </>
  );  
}

export default App;
