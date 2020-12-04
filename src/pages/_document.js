import Document, { Html, Head, Main, NextScript, } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link href='https://fonts.googleapis.com/css?family=Nunito:400,700,800&display=swap' rel='stylesheet' />
        </Head>
        <body>
          {/* <script async src='https://www.googletagmanager.com/gtag/js?id=G-ETPYPF2X0K' /> */}
          <script src='https://cdn.jsdelivr.net/npm/hls.js@latest' />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

// <!DOCTYPE html>
// <html>

// <head>
//   <title>bken.io</title>
//   <link rel="shortcut icon" href="./favicon.ico" />
//   <link href="https://fonts.googleapis.com/css?family=Nunito:400,700,800&display=swap" rel="stylesheet" />
//   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
//   <meta name="version" content="%REACT_APP_GIT_SHA%" />
//   <meta property="og:title" content="bken.io" />
//   <meta property="og:url" content="https://bken.io" />
//   <meta property="og:image" content="./favicon.ico" />
//   <meta property="og:description" content="bken.io is a video sharing platform" />
// </head>

// <body>
//   <div id="root"></div>
//   <!-- Google Adsense -->
//   <script async src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'>
//   </script>

//   <!-- Global site tag (gtag.js) - Google Analytics -->


//   <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
//   <!-- <script defer src="https://n9t33mxgzsjc.statuspage.io/embed/script.js"></script> -->
//   <script src="../src/index.js"></script>
// </body>

// </html>