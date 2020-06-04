import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { Icon, Loader, Progress, Segment, Popup, Container } from 'semantic-ui-react';

function timeConversion(startTime, completeTime) {
  const millisec = new Date(completeTime).getTime() - new Date(startTime).getTime();
  const seconds = (millisec / 1000).toFixed(1);
  const minutes = (millisec / (1000 * 60)).toFixed(1);
  const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return `${seconds} Sec`;
  }
  if (minutes < 60) {
    return `${minutes} Min`;
  }
  if (hours < 24) {
    return `${hours} Hrs`;
  }
  return `${days} Days`;
}

export default props => {
  const GET_VIDEO = gql`
    {
      video(id: "${props.id}") {
        id
        versions {
          status,
          preset,
          segments {
            done
            total
          }
        }
      }
    }
  `;

  const { loading, data, error, startPolling } = useQuery(GET_VIDEO);

  if (error) console.log(error);
  if (loading) return <Loader active />;

  if (data) {
    startPolling(2000);
    return data.video.versions.map(({ status, preset, segments: { done, total } }) => {
      return (
        <div key={preset} style={{ margin: '5px 0px 5px 0px' }}>
          <Segment>
            <div style={{ margin: '0px 0px 5px 0px' }}>{preset}</div>

            {/* <Popup
              header={preset}
              content='Uploaded to our backend'
              trigger={<Icon color='yellow' name='upload' />}
            />

            <Popup
              header={preset}
              content='Split into segments'
              trigger={<Icon color='yellow' name='film' />}
            />

            <Popup
              header={preset}
              content='Segments have been transcoded'
              trigger={<Icon color='yellow' name='cog' />}
            />

            <Popup
              header={preset}
              content='Segments have been recombined'
              trigger={<Icon color='yellow' name='filter' />}
            />

            <Popup
              header={preset}
              content='Published to our CDN'
              trigger={<Icon color='yellow' name='globe' />}
            /> */}

            <Progress
              attached='bottom'
              color={status === 'completed' ? 'green' : 'yellow'}
              value={done}
              total={total}
              size='tiny'
            />
          </Segment>
        </div>
      );
    });
  }
};
