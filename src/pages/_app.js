import '../styles/index.css';
import 'tailwindcss/tailwind.css';
import React from 'react';
import { Provider, } from 'next-auth/client';

function App({ Component, pageProps }) {
  return (
    <div>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </div>
  );
}

export default App;
