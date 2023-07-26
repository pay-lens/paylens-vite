import React, { FC, ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';

import Link from './components/atoms/Link/Link';

import ThemeProvider from './theme/ThemeProvider';

import './styles';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob(['./pages/*.tsx', './pages/*.jsx'], { eager: true });

const routes = Object.keys(pages).map((path) => {
  console.log('run routes');
  const name = path.match(/\.\/pages\/(.*)\.tsx$/)[1];
  // Use loadable() instead of React.lazy() for SSR
  const Component = loadable(pages[path]);

  console.log('set route:', name, pages[path]);

  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component: Component,
  };
});

interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = (props: AppProps) => {
  console.log('run App', routes);

  return (
    <ThemeProvider>
      <div {...props}>
        <nav>
          <ul>
            {routes.map(({ name, path }) => (
              <li key={path}>
                <Link to={path}>{name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <Routes>
          {routes.map(({ path, component: RouteComp }) => (
            <Route key={path} path={path} element={<RouteComp />} />
          ))}
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
