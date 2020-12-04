import React from 'react';
import { SnackbarProvider, } from 'notistack';
import { ThemeProvider, } from '@material-ui/styles';
import Layout from '../components/Layout';
import theme from './theme';
// import ApolloWrapper from './utils/apollo';
// import UserContextProvider from '../contexts/userContext';
// import SearchContextProvider from '../contexts/searchContext';

const Index = () => (
  <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={3}>
      <Layout />
    </SnackbarProvider>
  </ThemeProvider>
);

export default Index;