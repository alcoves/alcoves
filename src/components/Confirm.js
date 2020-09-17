import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import { useMutation } from '@apollo/client';
import { Typography, Button, TextField } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import resendCodeMut from '../gql/resendCode';
import confirmAccountMut from '../gql/confirmAccount';
import { useHistory } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
  margin: 10px;
  display: flex;
  min-width: 250px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export default function confirm() {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const qs = queryString.parse(window.location.search);
  const [state, setState] = useState({
    code: qs.code || '',
    userId: qs.userId || '',
  });

  const [
    resendCode,
    { loading: resendLoading, data: resendData, error: resendError },
  ] = useMutation(resendCodeMut, {
    variables: { input: { userId: state.userId } },
  });

  const [
    confirmAccount,
    { loading: confirmLoading, data: confirmData, error: confirmError },
  ] = useMutation(confirmAccountMut, {
    variables: { input: { userId: state.userId, code: state.code } },
  });

  useEffect(() => {
    if (resendData) enqueueSnackbar('New code sent! Please check email', { persist: false });
  }, [resendData]);

  useEffect(() => {
    if (confirmData) history.push('/login');
  }, [confirmData]);

  useEffect(() => {
    if (resendError) enqueueSnackbar('Error resending code', { variant: 'error', persist: false });
  }, [resendError]);

  useEffect(() => {
    if (confirmError)
      enqueueSnackbar('Error confirming your account', { variant: 'error', persist: false });
  }, [confirmError]);

  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value });
  }

  if (!state.userId) {
    return (
      <Container>
        <Typography variant='body1'>Please follow the link from your email</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <TextField
          fullWidth
          name='code'
          placeholder='Code'
          value={state.code}
          onChange={handleChange}
          disabled={resendLoading || confirmLoading}
        />
      </Row>
      <Row>
        <Button
          fullWidth
          color='secondary'
          onClick={resendCode}
          disabled={resendLoading || confirmLoading}>
          Resend
        </Button>
        <Button
          fullWidth
          color='primary'
          variant='outlined'
          onClick={confirmAccount}
          disabled={resendLoading || confirmLoading}>
          Confirm
        </Button>
      </Row>
    </Container>
  );
}
