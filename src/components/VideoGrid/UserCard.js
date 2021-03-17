import useSWR from 'swr';
import VideoMeta from './VideoMeta';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UserVideoCard({ v }) {
  const { data } = useSWR(`/api/users/${v.userId}`, fetcher);
  return <VideoMeta v={v} u={data} />;
}