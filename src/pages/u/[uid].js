import { Box, } from 'grommet';
import Head from 'next/head';
import styled from 'styled-components';
import Layout from '../../components/Layout';

const HeaderImage = styled.div`
  width: 100vw;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("${p => p.src}");
`;

export default function UserProfile() {
  // fetch data about user
  // show errors
  // load other components

  return (
    <>
      <Head>
        <title>user</title>
      </Head>
      <Layout>
        <Box direction='column'>
          <HeaderImage src='https://images.unsplash.com/photo-1609771270965-aeda41eee819?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' />
          <div>
            Avatar here
          </div>
          <div>
            Featured video
          </div>
          <div>
            Other videos
          </div>
        </Box>
      </Layout>
    </>
  );
}