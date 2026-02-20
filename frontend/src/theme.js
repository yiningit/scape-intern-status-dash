import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"BodyFont", Arial, sans-serif',

    h5: {
      fontFamily: '"HeadingFont", sans-serif',
      fontWeight: 400,
      color: '#ffffff',
      textTransform: 'uppercase',
    },
    h6: {
      fontFamily: '"BodyFont", sans-serif',
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: '"BodyFont", sans-serif',
      fontWeight: 400,
      color: '#a7a9b4'
    },
  },

  components: {
    MuiTreeItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          '--TreeView-itemChildrenIndentation': theme.typography.pxToRem(25),
        }),
        label: ({ theme }) => ({
          fontSize: theme.typography.pxToRem(14),
          fontFamily: theme.typography.fontFamily,
          letterSpacing: '0.04em',
        }),
      },
    },
  },

  palette: {
    primary: {
      main: '#fa70ab',
    },
    secondary: {
      main: '#ff007f',
    },
    success: {
      main: '#79be76',
    },
    fail: {
      main: '#ed1c24',
    },
    unknown: {
      main: '#a7a9b4',
    },
  },

  shape: {
    borderRadius: 4,
  },
});

export default theme;
