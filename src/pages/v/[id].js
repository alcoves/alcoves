import Head from 'next/head';
import moment from 'moment';
import useSWR from 'swr';
import { CircularProgress, } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';
import VideoPageUserCard from '../../components/VideoPageUserCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Video(props) {
  // const router = useRouter();
  // const [watchVideo, { called: watchVideoCalled }] = useApiLazy();
  // useEffect(() => {
  //   if (video && id && !watchVideoCalled) {
  //     watchVideo({ method: 'post', url: `/videos/${id}/views` });
  //   } 
  // }, [video]);

  const { data } = useSWR(props.url, fetcher, { initialData: props.video });
  console.log('data', data);

  if (data) {
    const subHeader = `${
      abbreviateNumber(data.views)} views ·
      ${moment(data.createdAt).fromNow()} · 
      ${data.visibility}
    `;

    return (
      <div>
        <Head>
          <title>{data.title}</title>
          <meta property='og:title' content={data.title} />
          <meta property='og:image' content={data.thumbnail} />
          <meta property='og:description' content={data.title} />
        </Head>
        <Layout>
          <div>
            <VideoPlayer url={data.hlsMasterLink} />
            <div className='m-3 flex flex-col'>
              <h1 className='text-3xl font-semibold text-gray-200'>{data.title}</h1>
              <p className='text-sm font-semibold text-gray-400'>
                {subHeader}
              </p>
              <VideoPageUserCard id={data.userId} />
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <Layout>
      <div align='center'>
        <CircularProgress isIndeterminate />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const url = `http://localhost:3000/api/videos/${params.id}`;
  const video = await fetcher(url);
  return { props: { video, url, id: params.id } };
}
