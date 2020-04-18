const BKEN_ENV = process.env.BKEN_ENV;
const NODE_ENV = process.env.NODE_ENV;

let secure;
let domain;

if (BKEN_ENV === 'prod' && NODE_ENV === 'production') {
  secure = true;
  domain = 'bken.io';
} else if (BKEN_ENV === 'dev' && NODE_ENV === 'production') {
  secure = true;
  domain = 'dev.bken.io';
} else {
  secure = false;
  domain = 'localhost';
}

export const secure = secure;
export const domain = domain;
