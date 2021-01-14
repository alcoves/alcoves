
import { useApi, } from '../../utils/api';
import VideoMeta from './VideoMeta';

export default function UserVideoCard({ v }) {
  const { data } = useApi(`/users/${v.userId}`);
  return <VideoMeta v={v} u={data} />;
}