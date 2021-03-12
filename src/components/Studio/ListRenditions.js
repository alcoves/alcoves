import { useEffect, } from 'react';
import { useApi, } from '../../utils/api';
import Spinner from '../Spinner';

let timer;

function Status(percentCompleted) {
  return (
    <>
      {percentCompleted === 100 ? (
        <svg
          xmlns='http://www.w3.org/2000/svg' 
          fill='none'
          stroke='green'
          className='w-6 h-6'
        >
          <path
            strokeWidth={2}
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </svg>
      ) : (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none' 
          stroke='orange'
          className='animate-spin w-6 h-6'
        >
          <path
            strokeLinecap='round' 
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          />
          <path
            strokeLinecap='round' 
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      )}
    </>
  );
}

export default function ListRenditions({ id }) {
  const { data, error, refetch }  = useApi({ url: `/videos/${id}` });

  useEffect(() => {
    clearInterval(timer);
    timer = setInterval(() => {
        refetch();
    }, 3000);

    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  if (data) {
    return (
      <div className='my-2 w-full'>
        <div style={{
          display: 'grid',
          gridGap: '1rem',
          gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
        }}
        >
          <div className='flex flex-col w-24'>
            <div className='flex flex-row items-end'>
              {Status(data.percentCompleted)}
              <p className='text-sm text-gray-300 font-bold'>{`${data.percentCompleted.toFixed(0)}%`}</p>
            </div>
            <div className='capitalize flex justify-center w-full flex-col text-gray-200'>
              <p className='font-bold'> 
                {data.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex m-3 justify-center'>
      {error ? <div>{JSON.stringify(error)}</div> : <Spinner />}
    </div>
  );
}