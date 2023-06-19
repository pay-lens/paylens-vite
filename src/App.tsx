import React, { FC, ReactNode } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import Header from './components/organisms/Header/Header';
import ThemeProvider from './theme/ThemeProvider';

import './styles';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.jsx', { eager: true });

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1];
  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component: pages[path].default,
  };
});

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
