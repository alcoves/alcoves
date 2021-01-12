import React from 'react';
import Layout from '../components/Layout';
import { useApi, } from '../utils/api';
import VideoGrid from '../components/VideoGrid/Index';
import Spinner from '../components/Spinner';

function index() {
  const { data } = useApi('/videos');

  if (data) {
    return (
      <Layout>
        <div className='p-2'>
          <h2 className='text-3xl mb-2 text-gray-100 font-bold'> Latest Videos </h2>
          {data && <VideoGrid videos={data} />}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex flex-row justify-center p-2'>
        <Spinner />
      </div>
    </Layout>
  );
}

export default index;