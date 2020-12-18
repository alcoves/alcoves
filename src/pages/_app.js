import '../styles/index.css';
import Head from 'next/head';
import { Grommet, } from 'grommet';
import { Provider, } from '../utils/store';
import theme from '../styles/theme';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Grommet full theme={theme} themeMode='dark'>
        <Provider>
          <Component {...pageProps} />
        </Provider>
      </Grommet>
    </>
  );  
}

export default App;
