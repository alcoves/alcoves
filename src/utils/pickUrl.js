function pickUrl(versions) {
  if (!versions || !versions.length) throw Error('no versions');
  return versions.filter(v => v.link)[0];
};

export default pickUrl;