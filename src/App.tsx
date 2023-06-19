import React, { FC, ReactNode } from 'react';

import Header from './components/organisms/Header/Header';
import ThemeProvider from './theme/ThemeProvider';

import './styles';

interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = (props: AppProps) => (
  <ThemeProvider>
    <div {...props}>
      <Header />

      <div className='card'>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  </ThemeProvider>
);

export default App;
