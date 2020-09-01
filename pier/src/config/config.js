const { WASABI_ENDPOINT, WASABI_CDN_BUCKET } = process.env;

if (!WASABI_ENDPOINT) {
  throw new Error(`process.env.WASABI_ENDPOINT must be defined, got ${WASABI_ENDPOINT}`);
}

if (!WASABI_CDN_BUCKET) {
  throw new Error(`process.env.WASABI_CDN_BUCKET must be defined, got ${WASABI_CDN_BUCKET}`);
}

module.exports = {
  TIDAL_BUCKET: 'tidal',
  WASABI_ENDPOINT,
  WASABI_CDN_BUCKET,
};
