import cookie from 'js-cookie';
import Router from 'next/router';
import nextCookie from 'next-cookies';

export const auth = ctx => {
  const { accessToken } = nextCookie(ctx);

  if (ctx.req && !accessToken) {
    console.log('server side login push');
    ctx.res.writeHead(302, { Location: '/login' });
    ctx.res.end();
    return;
  }

  // We already checked for server. This should only happen on client.
  if (!accessToken) {
    console.log('client side login push');
    Router.push('/login');
  }

  return accessToken;
};

export const logout = () => {
  cookie.remove('accessToken');
  Router.push('/login');
};
