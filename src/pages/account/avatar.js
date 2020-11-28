import React from 'react';
import styled from 'styled-components';
import { gql, useMutation, } from '@apollo/client';

const uploadAvatar = gql`
  mutation uploadAvatar($file: Upload!) {
    uploadAvatar(file: $file) {
      url
    }
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  padding-top: 20px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const Avatar = styled.div`
  width: 150px;
  display: flex;
  height: 150px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  backgroundPosition: center;
  background-size: 150px 150px;

  &:hover {
    opacity: .8;
    cursor: pointer;
  }
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
      <label htmlFor='upload-avatar'>
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
        <Avatar style={{ backgroundImage: `url(${avatar})` }} />
      </label>
    </AvatarContainer>
  );
}
