import axios from 'axios';
import { useEffect, useState, } from 'react';

function baseUrl() {
  if (process.env.NODE_ENV === 'production') return 'https://bken.io/api';
  return 'http://localhost:4000/api';
}

function fetch(config = { method: 'GET' }) {
  let token;
  if (!config.url) throw new Error('api request url not specified');
  config.url = `${baseUrl()}${config.url}`;
  
  if (process.browser) {
    token = localStorage.getItem('token')
  }

  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
      ...config.headers,
    };
  }

  return axios(config);
}

function useApi(globalConfig) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);

  function call() {
    setCalled(true);
    setLoading(true);
    // it's important to destructure so as to avoid pass by reference issues
    fetch({ ...globalConfig }).then((res) => {
      if (res.data) setData(res.data);
    }).catch((err) => {
      console.error(err);
      setError(err);
    }).then(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    call();
  }, []);

  return { data, error, called, loading, refetch: call };
}

function useApiLazy(globalConfig) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [called, setCalled] = useState(false);
  const [loading, setLoading] = useState(false);

  function call(callerConfig) {
    setCalled(true);
    setLoading(true);
    // it's important to destructure so as to avoid pass by reference issues
    fetch({ ...globalConfig, ...callerConfig }).then((res) => {
      if (res.data) setData(res.data);
    }).catch((err) => {
      console.error(err);
      setError(err);
    }).then(() => {
      setLoading(false);
    });
  }

  return [call, { data, error, called, loading, refetch: call }];
}

export { fetch, useApi, useApiLazy };