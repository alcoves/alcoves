import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>bken.io</title>
        <meta name='description' content='bken.io is a simple video sharing platform' />
        <meta property='og:title' content='bken.io' />
      </Head>
      {children}
    </div>
  );
}
