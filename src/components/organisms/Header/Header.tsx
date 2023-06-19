import React, { FC, ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

const Header: FC<HeaderProps> = (props: HeaderProps) => (
  <header {...props}>
    <h1>Vite + React</h1>
  </header>
);

export default Header;
