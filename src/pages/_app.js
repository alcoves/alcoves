import '../styles/index.css';
import Head from 'next/head';

function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>bken.io</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );  
}

export default App;
