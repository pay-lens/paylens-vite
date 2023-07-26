import React, { FC, ReactNode } from 'react';

import Header from '../components/organisms/Header/Header';

interface HomeProps {
  children?: ReactNode;
}

const Home: FC<HomeProps> = (props: HomeProps) => (
  <div {...props}>
    <Header />

    <div className='card'>
      <h1>PayLens Home</h1>
    </div>
  </div>
);

export default Home;
