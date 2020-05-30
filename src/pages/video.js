import Head from 'next/head';

const manifest = {
  version: 'v1',
  baseUrl: 'http://localhost:3000/segments',
  segments: [
    {
      name: '000000.mp4',
      duration: 10000,
    },
    {
      name: '000001.mp4',
      duration: 10000,
    },
    {
      name: '000002.mp4',
      duration: 10000,
    },
  ],
};

export default function Home() {
  return (
    <div className='container'>
      <Head>
        <title>Create Next App</title>
        <link rel='icon' href='/favicon.ico' />
        <script src='http://cdn.dashjs.org/v3.1.0/dash.all.min.js'></script>
      </Head>

      <main>
        <div>
          <video data-dashjs-player src='http://localhost:3000/test.mpd' controls></video>
        </div>

        <div>
          <video src={`${manifest.baseUrl}/${manifest.segments[0].name}`} controls></video>
        </div>
      </main>
    </div>
  );
}
