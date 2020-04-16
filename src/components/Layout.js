import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>bken.io</title>
      </Head>
      {children}
    </div>
  );
}
