// See https://github.com/kentcdodds/react-testing-library#global-config
import '@testing-library/jest-dom/extend-expect';
import 'jest-axe/extend-expect';

import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
