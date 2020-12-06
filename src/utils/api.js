import axios from 'axios';
import { useState, } from 'react';

function baseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://helm.bken.io/api2';
  }
  return 'http://localhost:4000/api2';
}

function lazyApi(url = '/', method = 'GET') {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  async function call(overrides) {
    try {
      setCalled(true);
      setLoading(true);
      const requestUrl = `${baseUrl()}${url}`;
      const res = await axios({
        method,
        url: requestUrl,
        ...overrides,
      });
      if (res.data) setData(res.data);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }

    return 'api request sent';
  }

  return [call, { data, error, called, loading }];
}

export { lazyApi };
export default lazyApi;