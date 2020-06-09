const { BKEN_ENV } = process.env;

if (BKEN_ENV !== 'dev' && BKEN_ENV !== 'prod') {
  throw new Error(`process.env.BKEN_ENV must be dev or prod, got ${BKEN_ENV}`);
}

module.exports = {
  USERS_TABLE: `users-${BKEN_ENV}`,
  TIDAL_TABLE: `tidal-${BKEN_ENV}`,
  VIDEOS_TABLE: `videos-${BKEN_ENV}`,
  TIDAL_BUCKET: `tidal-bken-${BKEN_ENV}`,
  WASABI_ENDPOINT: 'https://s3.us-east-2.wasabisys.com',
  WASABI_CDN_BUCKET: `${BKEN_ENV === 'dev' ? 'dev-' : ''}cdn.bken.io`,
};
