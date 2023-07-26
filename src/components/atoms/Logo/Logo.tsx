import React, { FC, ReactNode } from 'react';

interface LogoProps {
  children?: ReactNode;
}

const Logo: FC<LogoProps> = (props: LogoProps) => (
  <Logo {...props}>
    <h1>PayLens</h1>
  </Logo>
);

export default Logo;
