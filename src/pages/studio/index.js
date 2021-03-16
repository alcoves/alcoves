import { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import moment from 'moment';
import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';
import Spinner from '../../components/Spinner';
import videoDuration from '../../utils/videoDuration';

export default function studio() {
  const router = useRouter();
  const [getVideos, { data }] = useApiLazy();
  // const { user, authenticated, loading } = useContext(Context);

  const styles = {
    Duration: {
      right: '0',
      bottom: '0',
      zIndex: '0',
      color: 'white',
      fontSize: '12px',
      fontWeight: '600',
      position: 'absolute',
      borderRadius: '3px',
      margin: '0px 3px 3px 0px',
      padding: '0px 3px 0px 3px',
      background: 'rgba(0, 0, 0, 0.7)',
    },
    Visibility: {
      left: '0',
      bottom: '0',
      zIndex: '0',
      height: '24px',
      position: 'absolute',
      margin: '0px 0px 5px 5px',
    },
    VideoGridWrapper: {
      display: 'grid',
      gridGap: '1rem',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
  };

  useEffect(() => {
    if (user && user.id) {
      getVideos({ url: `/videos?userId=${user.id}&visibility=all` });
    }
  }, [user]);

  function metadata(v) {
    const createdAt = moment(v.createdAt).fromNow();
    return (
      `Created ${createdAt} · ${v.views} Views`
    );
  }

  if (data) {
    return (
      <Layout>
        <div style={styles.VideoGridWrapper}>
          {data.map(v => (
            <div
              key={v.id}
              className='flex flex-col content-start p-2'
            >
              <div style={{
                width: '100%',
                cursor: 'pointer',
                minHeight: '180px',
                maxHeight: '180px',
                position: 'relative',
                borderRadius: '4px',
                backgroundColor: 'grey',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundImage: `url("${v.thumbnail}")`,
                '-webkit-box-shadow': 'inset 0px -105px 66px -39px rgba(0,0,0,0.83)',
                '-moz-box-shadow': 'inset 0px -105px 66px -39px rgba(0,0,0,0.83)',
                boxShadow: 'inset 0px -105px 66px -39px rgba(0,0,0,0.83)',
              }} onClick={() => router.push(`/studio/${v.id}`)}>
                <div style={styles.Duration}>
                  <p size='xsmall'>
                    {videoDuration(v.duration)}
                  </p>
                </div>
                <div style={styles.visibility}>
                  {v.visibility === 'public' ? (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='green'>
                      <path
                        strokeLinecap='round' 
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round' 
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  ) : (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='#eee'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2} 
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      />
                    </svg>
                  )}
                </div>
              </div>
              <div className='overflow-ellipsis truncate flex flex-row content-center text-gray-200'>
                <h5>
                  {v.title}
                </h5>
              </div>
              <div direction='flex flex-row'>
                <p className='text-xs text-gray-400'>
                  {metadata(v)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  if (!loading && !authenticated) {
    return (
      <Layout>
        <div margin='small' align='center'>
          <h1 size='xsmall'>
            You must be authenticated
          </h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div margin='small' align='center'>
        <Spinner />
      </div>
    </Layout>
  );
}