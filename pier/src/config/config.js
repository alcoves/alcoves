const { BKEN_ENV } = process.env

if (BKEN_ENV !== 'dev' && BKEN_ENV !== 'prod') {
  throw new Error(`process.env.BKEN_ENV must be dev or prod, got ${BKEN_ENV}`)
}

module.exports = {
  USERS_TABLE: `users-${BKEN_ENV}`,
  VIDEOS_TABLE: `users-${BKEN_ENV}`,
  MEDIA_BUCKET_NAME: 'media-bken',
  UPLOAD_BUCKET_NAME: `tidal-bken-${BKEN_ENV}`,
  WASABI_ENDPOINT: 'https://s3.us-east-2.wasabisys.com',
};
