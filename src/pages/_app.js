import '../styles/index.css';
import Head from 'next/head';
import { SnackbarProvider, } from 'notistack';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <SnackbarProvider maxSnack={3}>
        <Component {...pageProps} />
      </SnackbarProvider>
    </>
  );  
}

export default App;
