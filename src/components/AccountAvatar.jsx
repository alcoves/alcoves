import React from 'react';
import styled from 'styled-components';
import { useMutation, } from '@apollo/client';
import { IconButton, } from '@material-ui/core';
import { CameraAlt, } from '@material-ui/icons';
import uploadAvatar from '../gql/uploadAvatar';

const AvatarContainer = styled.div`
  display: flex;
  padding-top: 20px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
`;

export default function AccountAvatar({ avatar }) {
  const [uploadAvatarMutation, { error }] = useMutation(uploadAvatar);

  if (error) {
    return (
      <div>
        <p>there was an error</p>
        <code>{JSON.stringify(error)}</code>
      </div>
    );
  }

  return (
    <AvatarContainer>
      <Avatar
        src={avatar}
        alt='avatar'
      />
      <input
        type='file'
        accept='image/*'
        id='upload-avatar'
        style={{ display: 'none' }}
        onChange={({ target }) => {
          const file = target.files[0];
          if (file) {
            uploadAvatarMutation({ variables: { file }, refetchQueries: ['me'] });
          }
        }}
      />
      <label htmlFor='upload-avatar'>
        <IconButton component='span'>
          <CameraAlt size='small' />
        </IconButton>
      </label>
    </AvatarContainer>
  );
}
