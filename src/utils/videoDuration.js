import moment from 'moment';

function videoDuration(d) {
  if (d) return d > 3600 ? moment.utc(d * 1000).format('H:mm:ss') : moment.utc(d * 1000).format('m:ss');
  return '0:00';
}

export default videoDuration;