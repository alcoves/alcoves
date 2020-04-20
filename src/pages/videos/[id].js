import React from 'react';
import moment from 'moment';
import Head from 'next/head';
import gql from 'graphql-tag';
import withApollo from '../../lib/withApollo';
import Navigation from '../../components/Navigation';

import { Link } from 'next/link';
import { useQuery } from '@apollo/react-hooks';
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
        userName
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

function Video({ data }) {
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

        <meta property='og:site_name' content='bken' />
        <meta property='og:title' content={data.video.title} />
        <meta name='description' content='bken is a simple video sharing platform' />
        <link rel='shortcut icon' href='./favicon.ico' />

        <meta
          property='og:image'
          content='https://s3.us-east-2.wasabisys.com/dev-cdn.bken.io/static/default-thumbnail-sm.jpg'
        />
        <meta
          property='og:image:secure_url'
          content='https://s3.us-east-2.wasabisys.com/dev-cdn.bken.io/static/default-thumbnail-sm.jpg'
        />
        <meta property='og:image:type' content='image/jpeg' />

        <meta property='og:type' content='video.other' />
        <meta property='og:url' content={`https://dev.bken.io/videos/${data.video.id}`} />
        <meta property='og:video' content={link} />
        <meta property='og:video:url' content={link} />
        <meta property='og:video:secure_url' content={link} />
        <meta property='og:video:type' content='video/mp4' />
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
                    {data.video.user.userName}
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

function VideoWrapper({ id }) {
  const { called, data, error, loading } = useQuery(QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: { id },
  });

  return (
    <div>
      {data ? (
        <Video data={data} />
      ) : (
        <Loader active inline='centered' style={{ marginTop: '30px' }} />
      )}
    </div>
  );
}

VideoWrapper.getInitialProps = ctx => {
  console.log('query id', ctx.query.id);
  return { id: ctx.query.id };
};

export default withApollo({ ssr: true })(VideoWrapper);
