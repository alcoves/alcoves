import React from 'react';
import moment from 'moment';
import Head from 'next/head';
import gql from 'graphql-tag';

import { Link } from 'next/link';
import { useRouter } from 'next/router';
import withApollo from '../../lib/withApollo';
import { useLazyQuery } from '@apollo/react-hooks';
import Navigation from '../../components/Navigation';
import { Loader, Container } from 'semantic-ui-react';

const QUERY = gql`
  query getVideo($id: String!) {
    video(id: $id) {
      id
      title
      views
      createdAt
      user {
        id
        avatar
        username
      }
      versions {
        link
        status
        preset
      }
    }
  }
`;

const pickUrl = ({ versions }) => {
  const loadOrder = ['libx264-2160p', 'libx264-1440p', 'libx264-1080p', 'libx264-720p'];
  for (const desiredPreset of loadOrder) {
    for (const { preset, link } of versions) {
      if (desiredPreset === preset && link) {
        return link;
      }
    }
  }
};

function Video() {
  const router = useRouter();
  const [getVideo, { called, data, error, loading }] = useLazyQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id: router.query.id },
  });

  if (!called && router.query.id) getVideo();

  if (data) {
    const outerDivStyle = {
      backgroundColor: '#000000',
      height: 'calc(100vh - 100px)',
      maxHeight: 'calc((9 / 16) * 100vw',
    };

    const link = pickUrl(data.video);

    return (
      <div>
        <Head>
          <title>{data.video.title}</title>
          <meta name='description' content='bken.io is a simple video sharing platform' />
          <meta property='og:title' content={data.video.title} />
          <meta property='og:url' content='https://dev.bken.io' />
          <meta property='og:title' content={data.video.title} />

          <meta property='og:video' content={link} />
          <meta property='og:video:url' content={link} />
          <meta property='og:video:secure_url' content={link} />
          <meta property='og:video:type' content='video/mp4' />
          <meta property='og:video:width' content='1920' />
          <meta property='og:video:height' content='1080' />
        </Head>
        <Navigation />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <div style={outerDivStyle}>
              {link ? (
                <video width='100%' height='100%' controls autoPlay>
                  <source src={link} type='video/mp4' />
                </video>
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'white',
                    flexDirection: 'column',
                  }}>
                  <Loader inline active />
                </div>
              )}
            </div>
            <div>
              <Container style={{ marginTop: '20px' }}>
                <div>
                  <h2>{data.video.title}</h2>
                  <p>
                    {`${data.video.views} views • ${moment(
                      parseInt(data.video.createdAt),
                    ).fromNow()}`}
                  </p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginTop: '10px',
                    height: '75px',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '10px',
                    }}>
                    <img
                      as={Link}
                      to={`/users/${data.video.user.id}`}
                      width={50}
                      height={50}
                      alt='profile'
                      src={data.video.user.avatar}
                      style={{
                        borderRadius: '50%',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                  <div style={{ height: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        height: '50%',
                      }}>
                      {data.video.user.username}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        height: '50%',
                      }}>
                      {data.video.user.followers || '0'} followers
                    </div>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
}

export default withApollo({ ssr: true })(Video);
