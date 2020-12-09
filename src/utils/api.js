import axios from 'axios';
import { useEffect, useState, } from 'react';

function baseUrl() {
  if (process.env.NODE_ENV === 'production') {
    return 'https://bken.io/api';
  }
  return 'http://localhost:4000/api';
}

function useApi(url = '/', overrides) {
  let token;
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);

  function fetch() {
    const requestUrl = `${baseUrl()}${url}`;
    const axiosRequestConfig = {
      url: requestUrl,
      method: 'GET',
    };
  
    if (process.browser) {
      token = localStorage.getItem('token');
    }
  
    if (token) {
      axiosRequestConfig.headers = {};
      axiosRequestConfig.headers.Authorization = `Bearer ${token}`;
    }
  
    axios({
      ...axiosRequestConfig,
      ...overrides,
    }).then((res) => {
      if (res.data) setData(res.data);
    }).catch((err) => {
      console.error(err);
      setError(err);
    }).then(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    setCalled(true);
    setLoading(true);
    fetch();
  }, []);

  return { data, error, called, loading, refetch: fetch };
}

function useApiLazy(url = '/', method = 'GET') {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  async function call(overrides) {
    try {
      setCalled(true);
      setLoading(true);

      if (overrides?.url) {
        url = overrides.url;
        delete overrides.url;
      }

      const requestUrl = `${baseUrl()}${url}`;
      const axiosRequestConfig = {
        method,
        url: requestUrl,
      };

      let token;
      if (process.browser) {
        token = localStorage.getItem('token');
      }

      if (token) {
        axiosRequestConfig.headers = {};
        axiosRequestConfig.headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios({
        ...axiosRequestConfig,
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

export { useApi, useApiLazy };