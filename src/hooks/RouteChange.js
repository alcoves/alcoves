import Router from 'next/router';
import { useEffect, } from 'react';

const useWarnIfUnsavedChanges = (unsavedChanges) => {
  useEffect(() => {
    const routeChangeStart = () => {
      if (unsavedChanges) {
        Router.events.emit('routeChangeError');
        Router.replace(Router, Router.asPath, { shallow: true });
        throw 'Abort route change. Please ignore this error.';
      }
    };

    Router.events.on('routeChangeStart', routeChangeStart);

    return () => {
      Router.events.off('routeChangeStart', routeChangeStart);
    };
  }, [unsavedChanges]);
};

export default useWarnIfUnsavedChanges;