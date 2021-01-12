
import { useApi, } from '../../utils/api';
import Spinner from '../Spinner';
import VideoMeta from './VideoMeta';

export default function UserVideoCard({ v }) {
  const { data } = useApi(`/users/${v.userId}`);

  if (data) {
    return (
      <VideoMeta v={v} u={data} />
    );
  }

  return (
    <div className='flex flex-row w-full'>
      <Spinner />
    </div>
  ); 
}