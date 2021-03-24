import Head from 'next/head';
import moment from 'moment';
import useSWR from 'swr';
import { CircularProgress, Flex, Box, Text, Heading  } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';
import VideoPageUserCard from '../../components/VideoPageUserCard';
import { useEffect, useRef } from 'react';

const fetcher = (url) => fetch(url).then((res) => res.json());

let hls;

export default function Video(props) {
  // const router = useRouter();
  // const [watchVideo, { called: watchVideoCalled }] = useApiLazy();
  // useEffect(() => {
  //   if (video && id && !watchVideoCalled) {
  //     watchVideo({ method: 'post', url: `/videos/${id}/views` });
  //   } 
  // }, [video]);

  const vRef = useRef(null)
  const { data } = useSWR(props.url, fetcher, { initialData: props.video });

  useEffect(() => {
    if (data.hlsMasterLink) {
      const video = document.getElementById('bkenVideoPlayer');
      hls = new window.Hls();
      hls.loadSource(data.hlsMasterLink);
      hls.attachMedia(video);
    }
  }, [data])

  if (data) {
    const subHeader = `${
      abbreviateNumber(data.views)} views ·
      ${moment(data.createdAt).fromNow()} · 
      ${data.visibility}
    `;

    return (
      <Box>
        <Head>
          <title>{data.title}</title>
          <meta property='og:title' content={data.title} />
          <meta property='og:image' content={data.thumbnail} />
          <meta property='og:description' content={data.title} />
        </Head>
        <Layout>
          <Box>
            {/* <VideoPlayer url={data.hlsMasterLink} /> */}
            <video
              autoPlay
              controls
              ref={vRef}
              id="bkenVideoPlayer"
              style={{ background: 'black', minHeight: "calc((9 / 16) * 100vw)", minWidth:'' }}
            />
            <Box p='4'>
              <Heading as='h3' size='lg'>{data.title}</Heading>
              <Text fontSize='sm'>{subHeader}</Text>
              <VideoPageUserCard id={data.userId} />
           </Box>
           </Box>
        </Layout>
      </Box>
    );
  }

  return (
    <Layout>
      <Flex justify='center'>
        <CircularProgress isIndeterminate />
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const url = `http://localhost:3000/api/videos/${params.id}`;
  const video = await fetcher(url);
  return { props: { video, url, id: params.id } };
}
