import React from 'react';
import useSWR from 'swr';
import { Flex, } from '@chakra-ui/react';
import VideoPlayer from '../../components/VideoPlayer/Index';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Index({
  error, urlPath, video: v,  
}) {
  const { data } = useSWR(urlPath && !error, fetcher, { initialData: v });

  return (
    <Flex h='100vh' w='100vw'>
      <VideoPlayer url={data.mpdLink} thumbnail={data.thumbnail}/>
    </Flex>
  );
}

export async function getServerSideProps({ params }) {
  const urlPath = `/api/videos/${params.id}`;
  try {
    const video = await fetcher(`http://localhost:3000${urlPath}`);
    return {
      props: {
        video, urlPath, id: params.id, 
      }, 
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: true, video: {}, urlPath, id: params.id, 
      }, 
    };
  }
}