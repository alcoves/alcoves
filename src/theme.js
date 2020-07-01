import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  typography: {
    h1: {
      color: '#b3b5bd',
    },
    h2: {
      color: '#b3b5bd',
    },
    h3: {
      color: '#b3b5bd',
    },
    h4: {
      color: '#b3b5bd',
    },
    h5: {
      color: '#b3b5bd',
    },
    h6: {
      color: '#b3b5bd',
    },
    subtitle1: {
      color: '#b3b5bd',
    },
    subtitle2: {
      color: '#b3b5bd',
    },
    body1: {
      color: '#b3b5bd',
    },
    body2: {
      color: '#b3b5bd',
    },
    fontFamily: 'Montserrat',
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: '#23272a',
      },
    },
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#00897b',
    },
    secondary: {
      main: '#bf1e2e',
    },
  },
});
