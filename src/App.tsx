import React, { FC, ReactNode, StrictMode, Suspense } from 'react';
import { Link, Route, Routes } from 'react-router-dom';

import ThemeProvider from './theme/ThemeProvider';

import './styles';

// Auto generates routes from files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob(['./pages/*.tsx', './pages/*.jsx'], { eager: true });

const routes = Object.keys(pages).map((path) => {
  const name = path.match(/\.\/pages\/(.*)\.tsx$/)[1];
  const Component = React.lazy(pages[path]);
  return {
    name,
    path: name === 'Home' ? '/' : `/${name.toLowerCase()}`,
    component: Component,
  };
});

interface AppProps {
  children?: ReactNode;
}

const App: FC<AppProps> = (props: AppProps) => (
  <StrictMode>
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

        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map(({ path, component: RouteComp }) => (
              <Route key={path} path={path} element={<RouteComp />} />
            ))}
          </Routes>
        </Suspense>
      </div>
    </ThemeProvider>
  </StrictMode>
);

export default App;
