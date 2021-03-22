import StudioVideo from './StudioVideo';

export default function StudioVideoGrid({ videos }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
      {videos.map(v => <StudioVideo v={v}/>)}
    </div>
  );  
}