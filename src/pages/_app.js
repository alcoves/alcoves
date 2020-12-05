import '../styles/index.css';
import Head from 'next/head';
import { Provider, } from '../utils/store';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Provider>
        <Component {...pageProps} />
      </Provider>
    </>
  );  
}

export default App;
