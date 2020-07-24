import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  typography: {
    h1: {
      color: '#fcfcfd',
      fontSize: '2em',
      fontWeight: 700,
    },
    h2: {
      color: '#fcfcfd',
      fontSize: '1.8em',
      fontWeight: 700,
    },
    h3: {
      color: '#fcfcfd',
      fontSize: '1.6em',
      fontWeight: 700,
    },
    h4: {
      color: '#fcfcfd',
      fontSize: '1.4em',
      fontWeight: 700,
    },
    h5: {
      color: '#fcfcfd',
      fontSize: '1.2em',
      fontWeight: 400,
    },
    h6: {
      color: '#fcfcfd',
      fontSize: '1em',
      fontWeight: 400,
    },
    subtitle1: {
      color: '#a9b1b7',
      fontSize: '.9em',
      fontWeight: 800,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
    },
    subtitle2: {
      color: '#a9b1b7',
      fontSize: '.7em',
      fontWeight: 800,
      letterSpacing: '.02em',
      textTransform: 'uppercase',
    },
    body1: {
      color: '#a9b1b7',
      fontSize: '1.1em',
      fontWeight: 400,
    },
    body2: {
      color: '#a9b1b7',
      fontSize: '1em',
      fontWeight: 400,
    },
    fontFamily: 'Nunito',
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
