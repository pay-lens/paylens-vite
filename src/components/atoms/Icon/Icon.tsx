import React, { FC, ReactNode } from 'react';

interface IconProps {
  children?: ReactNode;
  name?: string;
}

const Icon: FC<IconProps> = (props: IconProps) => (
  <Icon {...props}>
    <span>Icon placeholder</span>
  </Icon>
);

export default Icon;
