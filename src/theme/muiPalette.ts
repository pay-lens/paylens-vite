const getPalette = (theme = 'light') => ({
  type: theme,
  primary: {
    // light: will be calculated from palette.primary.main,
    main: '#196EC9',
    // dark: will be calculated from palette.primary.main,
    // contrastText: will be calculated to contrast with palette.primary.main
  },
  secondary: {
    // light: '#196EC9',
    main: '#DE022E',
    // dark: will be calculated from palette.secondary.main,
    // contrastText: '#DAAF2F',
  },
  // Used by `getContrastText()` to maximize the contrast between
  // the background and the text.
  contrastThreshold: 3,
  // Used by the functions below to shift a color's luminance by approximately
  // two indexes within its tonal palette.
  // E.g., shift from Red 500 to Red 300 or Red 700.
  tonalOffset: 0.2,
  text: {
    primary: theme === 'light' ? '#1D222A' : '#FFF9FB',
    // secondary: "rgba(0, 0, 0, 0.54)"
    // disabled: "rgba(0, 0, 0, 0.38)"
    // hint: "rgba(0, 0, 0, 0.38)"
  },
});

export { getPalette };
