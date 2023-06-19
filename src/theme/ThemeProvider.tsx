import React, { FC, ReactNode } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, responsiveFontSizes, Theme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { getPalette } from './muiPalette';

interface ThemeProviderProps {
  children?: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = (props: ThemeProviderProps) => {
  const prefersDarkMode: boolean = useMediaQuery('(prefers-color-scheme: dark)');
  const mode: string = prefersDarkMode ? 'dark' : 'light';

  const theme: Theme = responsiveFontSizes(
    createTheme({
      palette: getPalette(mode),
      typography: {
        h1: {
          fontSize: '3.1428rem' /* 44px */,
          lineHeight: '1.2727' /* 56px */,
        },
        h2: {
          fontSize: '2.2857rem' /* 32px */,
          lineHeight: '1.125' /* 36px */,
        },
        h3: {
          fontSize: '1.7142rem' /* 24px */,
          lineHeight: '1.25' /* 30px */,
        },
        h4: {
          fontSize: '1.2857rem' /* 18px */,
          lineHeight: '1.3333' /* 24px */,
        },
        h5: {
          fontSize: '1rem' /* 14px */,
          lineHeight: '1.5' /* 21px */,
        },
        h6: {
          fontSize: '0.8571rem' /* 12px */,
          lineHeight: '1.1667' /* 14px */,
        },
        subtitle1: {
          fontSize: '0.8571rem' /* 12px */,
          lineHeight: '1.1667' /* 14px */,
        },
        // subtitle2: {},
        body1: {
          fontSize: '1rem' /* 14px */,
          lineHeight: '1.5' /* 21px */,
        },
        // body2: {},
        // button: {},
        caption: {
          fontSize: '0.7143rem' /* 10px */,
          lineHeight: '1.2' /* 12px */,
        },
        // overline: {},
      },
    })
  );

  return <MuiThemeProvider {...props} theme={theme} />;
};

export default ThemeProvider;
