import cookie from 'cookie';

export default function parseCookie(req) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}
