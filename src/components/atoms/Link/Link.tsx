import React, { FC, ReactNode } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  children?: ReactNode;
  to: string;
  type?: 'external' | 'internal';
}

const Link: FC<LinkProps> = (props: LinkProps) => {
  const { to, type, ...rest } = props;

  switch (type) {
    case 'external': {
      return (
        <RouterLink to={to} {...rest} />
      );
    }
    default: {
      return (
        <a {...rest} />
      );
    }
  }
};

export default Link;
